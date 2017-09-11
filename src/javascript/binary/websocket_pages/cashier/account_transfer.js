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

    let accounts,
        el_transfer_from,
        el_transfer_to,
        el_currency;

    const populateAccounts = () => {
        const client_loginid = Client.get('loginid');

        el_transfer_from = document.getElementById('transfer_from');
        el_transfer_to   = document.getElementById('transfer_to');

        const fragment_transfer_from = document.createElement('div');
        const fragment_transfer_to   = document.createElement('div');

        const createOption = (fragments, loginid, currency, balance, data_to_get) => {
            const option  = document.createElement('option');
            option.setAttribute(`data-${data_to_get}`, loginid);
            option.setAttribute('data-currency', currency);
            option.setAttribute('data-balance', balance);
            option.appendChild(document.createTextNode(loginid));
            fragments.appendChild(option);
        };

        let has_crypto = false;
        let has_fiat   = false;
        accounts.forEach((account, idx) => {
            const loginid  = accounts[idx].loginid;
            const currency = accounts[idx].currency;
            const balance  = accounts[idx].balance;

            if (+account.balance) {
                createOption(fragment_transfer_from, loginid, currency, balance, 'from');
            }

            createOption(fragment_transfer_to, loginid, currency, balance, 'to');

            if (currency) {
                if (isCryptocurrency(currency)) {
                    has_crypto = true;
                } else {
                    has_fiat = true;
                }
            }
        });

        if (has_fiat && has_crypto) {
            document.getElementById('transfer_fee').setVisibility(1);
        }

        if (!fragment_transfer_from.childElementCount || !fragment_transfer_to.childElementCount) {
            showError();
            return;
        }

        const appendTransferOptions = (fragments, element) => {
            if (fragments.childElementCount > 1) {
                element.innerHTML = fragments.innerHTML;
            } else {
                const label = document.createElement('label');
                label.appendChild(document.createTextNode(fragments.innerText));

                element.parentNode.replaceChild(label, element);
            }
        };

        appendTransferOptions(fragment_transfer_from, el_transfer_from);
        appendTransferOptions(fragment_transfer_to, el_transfer_to);

        // show client's login id on top
        const opt_client = el_transfer_from.querySelector(`option[data-from="${client_loginid}"]`);
        if (opt_client && opt_client.index !== 0) {
            el_transfer_from.removeChild(opt_client);
            el_transfer_from.add(opt_client, el_transfer_from.firstChild);
            el_transfer_from.selectedIndex = 0;
        }

        showForm();
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

    const showForm = () => {
        el_currency = document.querySelector(`${form_id_hash} #currency`);

        hideSelectedInTransferTo();
        updateCurrency(el_currency);
        document.getElementById(form_id).setVisibility(1);
        bindValidation();

        el_transfer_from.addEventListener('change', () => {
            hideSelectedInTransferTo();
            updateCurrency(el_currency);

            // to update amount min and max as per selected account_from
            bindValidation();

            // update amount error
            const el_amount = document.getElementById('amount');
            if (el_amount && el_amount.value) {
                el_amount.dispatchEvent(new Event('change'));
            }
        });

        FormManager.handleSubmit({
            form_selector       : form_id_hash,
            fnc_response_handler: responseHandler,
        });
    };

    const hideSelectedInTransferTo = () => {
        const val_selected = getTransferAttr(el_transfer_from, 'data-from');
        const opt_to_hide  = el_transfer_to.querySelector(`option[data-to="${val_selected}"]`);

        const el_hidden = el_transfer_to.querySelectorAll('option.invisible');
        el_hidden.forEach((el) => {
            el.setVisibility(1);
        });

        if (opt_to_hide) {
            opt_to_hide.setVisibility(0);
            const opt_to_hide_idx = opt_to_hide.index;
            if (opt_to_hide_idx === el_transfer_to.selectedIndex) {
                el_transfer_to.selectedIndex =
                    opt_to_hide_idx === el_transfer_to.children.length - 1 ? 0 : opt_to_hide_idx + 1;
            }
        }
    };

    const updateCurrency = () => { elementTextContent(el_currency, getTransferAttr(el_transfer_from, 'data-currency')); };

    const getTransferAttr = (el, attribute) => el.options[el.selectedIndex].getAttribute(attribute);

    // TODO: change values when back-end updates logic
    const getMinAmount = () => (isCryptocurrency(getTransferAttr(el_transfer_from, 'data-currency')) ? 0.002 : 0.1);

    const getDecimals = () => (isCryptocurrency(getTransferAttr(el_transfer_from, 'data-currency')) ? '1, 3' : '1, 2');

    const bindValidation = () => {
        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: ['req', ['number', { type: 'float', decimals: getDecimals(), min: getMinAmount(), max: getTransferAttr(el_transfer_from, 'data-balance'), custom_message: 'This amount exceeds your withdrawal limit.' }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: () => getTransferAttr(el_transfer_from, 'data-from') },
            { request_field: 'account_to',                value: () => getTransferAttr(el_transfer_to, 'data-to') },
            { request_field: 'currency',                  value: () => getTransferAttr(el_transfer_from, 'data-currency') },
        ]);
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
        accounts = response.accounts;
        accounts.forEach((account, idx) => {
            elementTextContent(document.getElementById(`loginid_${(idx + 1)}`), account.loginid);
            elementTextContent(document.getElementById(`balance_${(idx + 1)}`), account.balance);
        });
        document.getElementById('success_form').setVisibility(1);
    };

    const onLoad = () => {
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
                accounts = response_transfer.accounts;
                if (!accounts || !accounts.length) {
                    showError();
                    return;
                }
                BinarySocket.send({ get_limits: 1 }).then((response_limits) => {
                    if (hasError(response_limits)) {
                        return;
                    }
                    populateAccounts();
                });
            });
        }
    };

    return {
        onLoad,
    };
})();

module.exports = AccountTransfer;
