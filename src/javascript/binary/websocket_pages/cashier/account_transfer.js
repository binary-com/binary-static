const BinarySocket       = require('../socket');
const Client             = require('../../base/client');
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
        client_currency;

    const populateAccounts = (accounts) => {
        client_loginid  = Client.get('loginid');
        client_currency = Client.get('currency');

        el_transfer_from = document.getElementById('lbl_transfer_from');
        el_transfer_to   = document.getElementById('transfer_to');

        elementTextContent(el_transfer_from, client_loginid);

        const fragment_transfer_to   = document.createElement('div');

        let has_crypto = false;
        let has_fiat   = false;
        accounts.forEach((account, idx) => {
            const loginid  = accounts[idx].loginid;
            const currency = accounts[idx].currency;

            if (loginid !== client_loginid) {
                const option  = document.createElement('option');
                option.appendChild(document.createTextNode(loginid));
                fragment_transfer_to.appendChild(option);
            }

            if (currency) {
                if (isCryptocurrency(currency)) {
                    has_crypto = true;
                } else {
                    has_fiat = true;
                }
            }
        });

        if (!fragment_transfer_to.childElementCount) {
            showError();
            return;
        }
        if (fragment_transfer_to.childElementCount > 1) {
            el_transfer_to.innerHTML = fragment_transfer_to.innerHTML;
        } else {
            const label = document.createElement('label');
            label.appendChild(document.createTextNode(fragment_transfer_to.innerText));
            label.setAttribute('data-value', fragment_transfer_to.innerText);

            el_transfer_to.parentNode.replaceChild(label, el_transfer_to);
        }

        showForm();

        if (has_fiat && has_crypto) {
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
    const getMinAmount = () => (isCryptocurrency(client_currency) ? 0.002 : 0.1);

    const getDecimals = () => (isCryptocurrency(client_currency) ? '1, 8' : '1, 2');

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        document.getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: ['req', ['number', { type: 'float', decimals: getDecimals(), min: getMinAmount(), max: Client.get('balance'), custom_message: 'This amount exceeds your withdrawal limit.' }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: client_loginid },
            { request_field: 'account_to',                value: () => el_transfer_to.value || el_transfer_to.getAttribute('data-value') },
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
            BinarySocket.send({ transfer_between_accounts: 1 }).then(data => populateReceipt(data));
        }
    };

    const populateReceipt = (response) => {
        document.getElementById(form_id).setVisibility(0);
        response.accounts.forEach((account, idx) => {
            elementTextContent(document.getElementById(`loginid_${(idx + 1)}`), account.loginid);
            elementTextContent(document.getElementById(`balance_${(idx + 1)}`), account.balance);
        });
        document.getElementById('success_form').setVisibility(1);
    };

    const onLoad = () => {
        BinarySocket.wait('balance').then(() => {
            const error_element_to_show = [messages.parent];
            if (!Client.hasMultiAccountsOfType('real', true)) {
                error_element_to_show.push(messages.error);
            }
            if (!Client.get('balance') || +Client.get('balance') === 0) {
                error_element_to_show.push(messages.deposit);
            }
            if (error_element_to_show.length > 1) {
                error_element_to_show.forEach((id) => {
                    document.getElementById(id).setVisibility(1);
                });
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
