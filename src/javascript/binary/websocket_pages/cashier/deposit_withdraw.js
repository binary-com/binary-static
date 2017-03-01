const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const localize             = require('../../base/localize').localize;
const default_redirect_url = require('../../base/url').default_redirect_url;
const template             = require('../../base/utility').template;
const appendTextValueChild = require('../../common_functions/common_functions').appendTextValueChild;
const FormManager          = require('../../common_functions/form_manager');

const DepositWithdraw = (function() {
    'use strict';

    let cashier_type;
    const container = '#deposit_withdraw';
    const hidden_class = 'invisible';

    const init = function(cashier_password) {
        if (cashier_password) {
            showMessage('cashier_locked_message');
            sessionStorage.setItem('cashier_lock_redirect', window.location.href);
            return;
        }
        if (cashier_type === 'withdraw') {
            initWithdrawForm();
        } else if (cashier_type === 'deposit' && Client.get('currency')) {
            getCashierURL();
        } else {
            showCurrency();
        }
    };

    const commonResponseHandler = (response) => {
        if ('error' in response) {
            showError('custom_error', response.error.message);
        } else {
            getCashierURL();
        }
    };

    const initWithdrawForm = function() {
        BinarySocket.send({
            verify_email: Client.get('email'),
            type        : 'payment_withdraw',
        }).then((response) => {
            if ('error' in response) {
                showError('custom_error', response.error.message);
            } else {
                showMessage('check_email_message');
                const withdraw_form_id = '#frm_withdraw';
                $(withdraw_form_id).removeClass(hidden_class);
                FormManager.init(withdraw_form_id, [{ selector: '#verification_code', validations: ['req', 'email_token'] }]);
                FormManager.handleSubmit(withdraw_form_id, populateReq(), handleCashierResponse);
            }
        });
    };

    const showCurrency = function() {
        const currencies = Client.get('currencies').split(',');
        currencies.forEach(function(c) {
            appendTextValueChild('select_currency', c, c);
        });
        showMessage('choose_currency_message');
        const currency_form_id = '#frm_currency';
        $(currency_form_id).removeClass(hidden_class);
        FormManager.init(currency_form_id, [{ selector: '#select_currency', request_field: 'set_account_currency' }]);
        FormManager.handleSubmit(currency_form_id, {}, commonResponseHandler);
    };

    const getCashierType = function() {
        const $heading = $(container).find('#heading');
        const hash_value = window.location.hash;
        if (/withdraw/.test(hash_value)) {
            cashier_type = 'withdraw';
            $heading.text(localize('Withdraw'));
        } else if (/deposit/.test(hash_value)) {
            cashier_type = 'deposit';
            $heading.text(localize('Deposit'));
        }
    };

    const populateReq = function(verification_token) {
        const req = { cashier: cashier_type };
        if (verification_token) req.verification_code = verification_token;
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';
        return req;
    };

    const getCashierURL = function() {
        BinarySocket.send(populateReq()).then(response => handleCashierResponse(response));
    };

    const hideAll = function(option) {
        $('#frm_withdraw, #frm_currency, #frm_ukgc, #errors').addClass(hidden_class);
        if (option) {
            $(option).addClass(hidden_class);
        }
    };

    const showError = function(id, error) {
        hideAll();
        if (error) $(`#${id}`).text(error);
        showMessage(id, 'errors');
    };

    const showMessage = function(id, parent = 'messages') {
        $(`#${id}`).siblings().addClass(hidden_class).end()
            .removeClass(hidden_class);
        $(container).find(`#${parent}`).removeClass(hidden_class);
    };

    const showPersonalDetailsError = function(details) {
        const msgID = 'personal_details_message';
        let errorFields;
        if (details) {
            errorFields = {
                province: 'State/Province',
                country : 'Country',
                city    : 'Town/City',
                street  : 'First line of home address',
                pcode   : 'Postal Code / ZIP',
                phone   : 'Telephone',
                email   : 'Email address',
            };
        }
        const $el = $('#' + msgID),
            errMsg = template($el.html(), [localize(details ? errorFields[details] : 'details')]);
        $el.html(errMsg);
        showMessage(msgID);
    };

    const initUKGC = () => {
        const ukgc_form_id = '#frm_ukgc';
        $(ukgc_form_id).removeClass(hidden_class);
        FormManager.init(ukgc_form_id, [{ request_field: 'ukgc_funds_protection', value: 1 }]);
        FormManager.handleSubmit(ukgc_form_id, { tnc_approval: 1 }, commonResponseHandler);
    };

    const handleCashierResponse = (response) => {
        hideAll('#messages');
        const error = response.error;
        if (error) {
            switch (error.code) {
                case 'ASK_TNC_APPROVAL':
                    showError('tnc_error');
                    break;
                case 'ASK_FIX_DETAILS':
                    showPersonalDetailsError(error.details);
                    break;
                case 'ASK_UK_FUNDS_PROTECTION':
                    initUKGC();
                    break;
                case 'ASK_AUTHENTICATE':
                    showMessage('not_authenticated_message');
                    break;
                case 'ASK_FINANCIAL_RISK_APPROVAL':
                    showError('financial_risk_error');
                    break;
                case 'ASK_JP_KNOWLEDGE_TEST':
                    showError('knowledge_test_error');
                    break;
                case 'JP_NOT_ACTIVATION':
                    showError('activation_error');
                    break;
                case 'ASK_AGE_VERIFICATION':
                    showError('age_error');
                    break;
                default:
                    showError('custom_error', error.message);
            }
        } else {
            $(container).find('iframe').attr('src', response.cashier).parent()
                .removeClass(hidden_class);
        }
    };

    const onLoad = function() {
        getCashierType();
        BinarySocket.wait('get_account_status').then((response) => {
            const status = response.get_account_status.status;
            const cashier_locked  = /cashier_locked/.test(status);
            const unwelcome       = /unwelcome/.test(status);
            const withdraw_locked = /withdrawal_locked/.test(status);

            if ((cashier_type === 'deposit' && !cashier_locked && !unwelcome) ||
                (cashier_type === 'withdraw' && !cashier_locked && !withdraw_locked)) {
                BinarySocket.send({ cashier_password: 1 }).then((data) => {
                    if ('error' in data) {
                        showError('custom_error', data.error.message);
                    } else {
                        init(data.cashier_password);
                    }
                });
            } else {
                BinaryPjax.load(default_redirect_url());
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = DepositWithdraw;
