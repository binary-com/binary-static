const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const getPropertyValue   = require('../../base/utility').getPropertyValue;
const createElement      = require('../../base/utility').createElement;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;
const isCryptocurrency   = require('../../common_functions/currency').isCryptocurrency;
const FormManager        = require('../../common_functions/form_manager');

const AccountTransfer = (() => {
    const form_id       = 'frm_account_transfer';
    const form_id_hash  = `#${form_id}`;

    const messages = {
        parent : 'client_message',
        error  : 'no_account',
        deposit: 'no_balance',
    };

    let el_transfer_from,
        el_transfer_to,
        client_loginid,
        client_currency,
        client_balance;

    const populateAccounts = (accounts) => {
        client_loginid  = Client.get('loginid');
        client_currency = Client.get('currency');

        el_transfer_from = document.getElementById('lbl_transfer_from');
        el_transfer_to   = document.getElementById('transfer_to');

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
            el_transfer_to = document.getElementById('transfer_to');
        }

        showForm();

        if (Client.hasCurrencyType('crypto') && Client.hasCurrencyType('fiat')) {
            document.getElementById('transfer_fee').setVisibility(1);
        }
    };

    const hasError = (response) => {
        const error = response.error;
        if (error) {
            const el_error = document.getElementById('error_message').getElementsByTagName('p')[0];
            elementTextContent(el_error, error.message);
            el_error.parentNode.setVisibility(1);
            return true;
        }
        return false;
    };

    const showError = () => {
        document.getElementById(messages.parent).setVisibility(1);
        document.getElementById(messages.error).setVisibility(1);
    };

    // TODO: change values when back-end updates logic
    const getMinAmount = () => (isCryptocurrency(client_currency) ? 0.002 : 1);

    const getDecimals = () => (isCryptocurrency(client_currency) ? '1, 8' : '1, 2');

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        document.getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', decimals: getDecimals(), min: getMinAmount(), max: client_balance, custom_message: 'This amount exceeds your withdrawal limit.' }]] },

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
            const el_error = document.getElementById('form_error');
            elementTextContent(el_error, response.error.message);
            el_error.setVisibility(1);
        } else {
            BinarySocket.send({ transfer_between_accounts: 1 }).then(data => populateReceipt(response, data));
        }
    };

    const populateReceipt = (response_submit_success, response) => {
        document.getElementById(form_id).setVisibility(0);

        elementTextContent(document.getElementById('from_loginid'), client_loginid);
        elementTextContent(document.getElementById('to_loginid'), response_submit_success.client_to_loginid);

        response.accounts.forEach((account) => {
            if (account.loginid === client_loginid) {
                elementTextContent(document.getElementById('from_balance'), account.balance);
            } else if (account.loginid === response_submit_success.client_to_loginid) {
                elementTextContent(document.getElementById('to_balance'), account.balance);
            }
        });

        document.getElementById('transfer_fee').setVisibility(0);
        document.getElementById('success_form').setVisibility(1);
    };

    const onLoad = () => {
        if (!Client.canTransferFunds()) {
            BinaryPjax.loadPreviousUrl();
        }
        BinarySocket.wait('balance').then((response) => {
            client_balance = getPropertyValue(response, ['balance', 'balance']);
            if (!client_balance || +client_balance === 0) {
                document.getElementById(messages.parent).setVisibility(1);
                document.getElementById(messages.deposit).setVisibility(1);
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
