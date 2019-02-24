const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const BinarySocket       = require('../../base/socket');
const Currency           = require('../../common/currency');
const FormManager        = require('../../common/form_manager');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const localize           = require('../../../_common/localize').localize;
const State              = require('../../../_common/storage').State;
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
        el_reset_transfer,
        el_transfer_fee,
        el_fee_amount,
        el_fee_minimum,
        el_success_form,
        client_balance,
        client_currency,
        client_loginid,
        withdrawal_limit,
        max_amount,
        transferable_amount,
        transfer_to_currency;

    const populateAccounts = (accounts) => {
        client_loginid   = Client.get('loginid');
        el_transfer_from = getElementById('lbl_transfer_from');
        el_transfer_to   = getElementById('transfer_to');

        elementTextContent(el_transfer_from, `${client_loginid} ${client_currency ? `(${client_currency})` : ''}`);

        const fragment_transfer_to = document.createElement('div');

        accounts.forEach((account) => {
            if (Client.canTransferFunds(account)) {
                const option = document.createElement('option');
                option.setAttribute('data-currency', account.currency);
                option.appendChild(document.createTextNode(`${account.loginid}${account.currency ? ` (${account.currency})` : ''}`));
                fragment_transfer_to.appendChild(option);
            }
        });

        if (!fragment_transfer_to.childElementCount) {
            showError();
            return;
        }
        el_transfer_to.innerHTML = fragment_transfer_to.innerHTML;
        el_transfer_to.onchange = () => {
            setTransferFeeAmount();
        };

        transfer_to_currency = getElementById('amount-add-on');
        transfer_to_currency.textContent = Client.get('currency');
        getElementById('transfer_to_account').textContent = el_transfer_to.value;

        showForm();

        if (Client.hasCurrencyType('crypto') && Client.hasCurrencyType('fiat')) {
            setTransferFeeAmount();
            elementTextContent(el_fee_minimum, Currency.getMinimumTransferFee(client_currency));
            el_transfer_fee.setVisibility(1);
        } else {
            const to_currency = el_transfer_to.getAttribute('data-currency');
            el_transfer_fee.setVisibility(client_currency !== to_currency);
        }
    };

    const setTransferFeeAmount = () => {
        elementTextContent(el_fee_amount, Currency.getTransferFee(client_currency, (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').match(/\((\w+)\)/)[1]));
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

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', decimals: Currency.getDecimalPlaces(client_currency), min: Currency.getTransferLimits(client_currency, 'min'), max: transferable_amount, format_money: true }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: client_loginid },
            { request_field: 'account_to',                value: () => (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').split(' (')[0] },
            { request_field: 'currency',                  value: client_currency },
        ]);

        FormManager.handleSubmit({
            form_selector       : form_id_hash,
            fnc_response_handler: responseHandler,
            enable_button       : true,
        });
    };

    const responseHandler = (response) => {
        if (response.error) {
            const el_error = getElementById('form_error');
            elementTextContent(el_error, response.error.message);
            el_error.setVisibility(1);
            // Auto hide error after 5 seconds.
            setTimeout(() => el_error.setVisibility(0), 5000);
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
                getElementById('from_currency').innerHTML = Currency.formatCurrency(account.currency);
                elementTextContent(getElementById('from_balance'), account.balance);
            } else if (account.loginid === response_submit_success.client_to_loginid) {
                getElementById('to_currency').innerHTML = Currency.formatCurrency(account.currency);
                elementTextContent(getElementById('to_balance'), account.balance);
            }
        });

        el_transfer_fee.setVisibility(0);
        el_success_form.setVisibility(1);
    };

    const onClickReset = () => {
        el_success_form.setVisibility(0);
        getElementById('amount').value = '';
        onLoad();
    };

    const onLoad = () => {
        if (!Client.canTransferFunds()) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        el_transfer_fee   = getElementById('transfer_fee');
        el_fee_amount     = getElementById('transfer_fee_amount');
        el_fee_minimum    = getElementById('transfer_fee_minimum');
        el_success_form   = getElementById('success_form');
        el_reset_transfer = getElementById('reset_transfer');
        el_reset_transfer.addEventListener('click', onClickReset);

        BinarySocket.wait('balance').then((response) => {
            client_balance   = +getPropertyValue(response, ['balance', 'balance']);
            client_currency  = Client.get('currency');
            const min_amount = Currency.getTransferLimits(client_currency, 'min');
            if (!client_balance || client_balance < +min_amount) {
                getElementById(messages.parent).setVisibility(1);
                if (client_currency) {
                    elementTextContent(getElementById('min_required_amount'), `${client_currency} ${min_amount}`);
                    getElementById(messages.balance).setVisibility(1);
                }
                getElementById(messages.deposit).setVisibility(1);
            } else {
                const req_transfer_between_accounts = BinarySocket.send({ transfer_between_accounts: 1 });
                const req_get_limits                = BinarySocket.send({ get_limits: 1 });

                Promise.all([req_transfer_between_accounts, req_get_limits]).then(() => {
                    const response_transfer = State.get(['response', 'transfer_between_accounts']);
                    const response_limits   = State.get(['response', 'get_limits']);

                    if (hasError(response_transfer)) {
                        return;
                    }
                    const accounts = response_transfer.accounts;
                    if (!accounts || !accounts.length) {
                        showError();
                        return;
                    }
                    if (hasError(response_limits)) {
                        return;
                    }
                    withdrawal_limit = +response_limits.get_limits.remainder;

                    if (withdrawal_limit < +min_amount) {
                        getElementById(messages.limit).setVisibility(1);
                        getElementById(messages.parent).setVisibility(1);
                        return;
                    }
                    max_amount = Currency.getTransferLimits(
                        Client.get('currency'),
                        'max'
                    );
                    transferable_amount = max_amount ?
                        Math.min(max_amount, withdrawal_limit, client_balance) :
                        Math.min(withdrawal_limit, client_balance);

                    getElementById('range_hint_min').textContent = min_amount;
                    getElementById('range_hint_max').textContent = transferable_amount.toFixed(
                        Currency.getDecimalPlaces(
                            Client.get('currency')
                        )
                    );
                    populateHints();
                    populateAccounts(accounts);
                });
            }
        });
    };

    const populateHints = () => {
        getElementById('limit_current_balance').innerHTML  = Currency.formatMoney(
            client_currency,
            client_balance,
        );

        getElementById('limit_daily_withdrawal').innerHTML = Currency.formatMoney(
            client_currency,
            withdrawal_limit,
        );

        getElementById('limit_max_amount').innerHTML = max_amount ? Currency.formatMoney(
            client_currency,
            max_amount,
        ) : localize('Not announced for this currency.');

        $('#range_hint').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : true,
        });

        getElementById('range_hint').show();
    };

    const onUnload = () => {
        if (el_reset_transfer) el_reset_transfer.removeEventListener('click', onClickReset);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = AccountTransfer;
