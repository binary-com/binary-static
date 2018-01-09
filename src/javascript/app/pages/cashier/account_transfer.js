const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const BinarySocket       = require('../../base/socket');
const isCryptocurrency   = require('../../common/currency').isCryptocurrency;
const getMinWithdrawal   = require('../../common/currency').getMinWithdrawal;
const FormManager        = require('../../common/form_manager');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const localize           = require('../../../_common/localize').localize;
const createElement      = require('../../../_common/utility').createElement;
const getPropertyValue   = require('../../../_common/utility').getPropertyValue;

const AccountTransfer = (() => {
    const form_id       = 'frm_account_transfer';
    const form_id_hash  = `#${form_id}`;

    const messages = {
        parent : 'client_message',
        error  : 'no_account',
        balance: 'not_enough_balance',
        deposit: 'no_balance',
        limit  : 'limit_reached',
    };

    let el_transfer_from,
        el_transfer_to,
        client_loginid,
        client_currency,
        client_balance,
        withdrawal_limit;

    const populateAccounts = (accounts) => {
        client_loginid   = Client.get('loginid');
        el_transfer_from = getElementById('lbl_transfer_from');
        el_transfer_to   = getElementById('transfer_to');

        let currency_text = client_currency ? `(${client_currency})` : '';

        elementTextContent(el_transfer_from, `${client_loginid} ${currency_text}`);

        const fragment_transfer_to = document.createElement('div');

        accounts.forEach((account, idx) => {
            if (accounts[idx].loginid !== client_loginid) {
                const option   = document.createElement('option');
                const currency = accounts[idx].currency;
                currency_text  = currency ? `(${currency})` : '';
                option.appendChild(document.createTextNode(`${accounts[idx].loginid} ${currency_text}`));
                fragment_transfer_to.appendChild(option);
            }
        });

        if (!fragment_transfer_to.childElementCount) {
            showError();
            return;
        }
        if (fragment_transfer_to.childElementCount > 1) {
            el_transfer_to.innerHTML = fragment_transfer_to.innerHTML;
        } else {
            const label = createElement('label', { 'data-value': fragment_transfer_to.innerText });
            label.appendChild(document.createTextNode(fragment_transfer_to.innerText));
            label.id = 'transfer_to';

            el_transfer_to.parentNode.replaceChild(label, el_transfer_to);
            el_transfer_to = getElementById('transfer_to');
        }

        showForm();

        if (Client.hasCurrencyType('crypto') && Client.hasCurrencyType('fiat')) {
            getElementById('transfer_fee').setVisibility(1);
        }
    };

    const hasError = (response) => {
        const error = response.error;
        if (error) {
            const el_error = getElementById('error_message').getElementsByTagName('p')[0];
            elementTextContent(el_error, error.message);
            if (el_error.parentNode) {
                el_error.parentNode.setVisibility(1);
            }
            return true;
        }
        return false;
    };

    const showError = () => {
        getElementById(messages.parent).setVisibility(1);
        getElementById(messages.error).setVisibility(1);
    };

    const getDecimals = () => (isCryptocurrency(client_currency) ? 8 : 2);

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', decimals: getDecimals(), min: getMinWithdrawal(client_currency), max: Math.min(+withdrawal_limit, +client_balance), format_money: true }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: client_loginid },
            { request_field: 'account_to',                value: () => (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').split(' (')[0] },
            { request_field: 'currency',                  value: client_currency },
        ]);

        FormManager.handleSubmit({
            form_selector       : form_id_hash,
            fnc_response_handler: responseHandler,
        });
    };

    const responseHandler = (response) => {
        if (response.error) {
            const el_error = getElementById('form_error');
            elementTextContent(el_error, response.error.message);
            el_error.setVisibility(1);
        } else {
            BinarySocket.send({ transfer_between_accounts: 1 }).then(data => populateReceipt(response, data));
        }
    };

    const populateReceipt = (response_submit_success, response) => {
        getElementById(form_id).setVisibility(0);

        elementTextContent(getElementById('from_loginid'), client_loginid);
        elementTextContent(getElementById('to_loginid'), response_submit_success.client_to_loginid);

        response.accounts.forEach((account) => {
            if (account.loginid === client_loginid) {
                elementTextContent(getElementById('from_balance'), account.balance);
            } else if (account.loginid === response_submit_success.client_to_loginid) {
                elementTextContent(getElementById('to_balance'), account.balance);
            }
        });

        getElementById('transfer_fee').setVisibility(0);
        getElementById('success_form').setVisibility(1);
    };

    const onLoad = () => {
        if (!Client.canTransferFunds()) {
            BinaryPjax.loadPreviousUrl();
        }
        BinarySocket.wait('balance').then((response) => {
            client_balance   = getPropertyValue(response, ['balance', 'balance']);
            client_currency  = Client.get('currency');
            const min_amount = getMinWithdrawal(client_currency);
            if (!client_balance || +client_balance < min_amount) {
                getElementById(messages.parent).setVisibility(1);
                if (client_currency) {
                    elementTextContent(getElementById('min_required_amount'), `${client_currency} ${min_amount}`);
                    getElementById(messages.balance).setVisibility(1);
                }
                getElementById(messages.deposit).setVisibility(1);
            } else {
                BinarySocket.send({ transfer_between_accounts: 1 }).then((response_transfer) => {
                    if (hasError(response_transfer)) {
                        return;
                    }
                    const accounts = response_transfer.accounts;
                    if (!accounts || !accounts.length) {
                        showError();
                        return;
                    }
                    BinarySocket.send({ get_limits: 1 }).then((response_limits) => {
                        if (hasError(response_limits)) {
                            return;
                        }
                        if (+response_limits.get_limits.remainder < min_amount) {
                            getElementById(messages.limit).setVisibility(1);
                            getElementById(messages.parent).setVisibility(1);
                            return;
                        }
                        withdrawal_limit = response_limits.get_limits.remainder;
                        getElementById('range_hint').textContent = `${localize('Min')}: ${min_amount} ${localize('Max')}: ${localize(+client_balance <= +withdrawal_limit ? 'Current balance' : 'Withdrawal limit')}`;
                        populateAccounts(accounts);
                    });
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = AccountTransfer;
