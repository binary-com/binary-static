const BinarySocket         = require('../socket');
const Client               = require('../../base/client');
const localize             = require('../../base/localize').localize;
const template             = require('../../base/utility').template;
const appendTextValueChild = require('../../common_functions/common_functions').appendTextValueChild;
const FormManager          = require('../../common_functions/form_manager');

const DepositWithdraw = (() => {
    'use strict';

    let cashier_type;
    const container = '#deposit_withdraw';
    let verification_code;

    const init = (cashier_password) => {
        if (cashier_password) {
            showMessage('cashier_locked_message');
            sessionStorage.setItem('cashier_lock_redirect', window.location.href);
            return;
        }
        if (!Client.get('currency')) {
            showCurrency();
        } else {
            initDepositWithdraw();
        }
    };

    const initDepositWithdraw = (response) => {
        if (response && response.error) {
            showError('custom_error', response.error.message);
        } else if (cashier_type === 'deposit') {
            getCashierURL();
        } else if (cashier_type === 'withdraw') {
            hideAll('#messages');
            initWithdrawForm();
        }
    };

    const initWithdrawForm = () => {
        BinarySocket.send({
            verify_email: Client.get('email'),
            type        : 'payment_withdraw',
        }).then((response) => {
            if ('error' in response) {
                showError('custom_error', response.error.message);
            } else {
                showMessage('check_email_message');
                const withdraw_form_id = '#frm_withdraw';
                $(withdraw_form_id).setVisibility(1);
                FormManager.init(withdraw_form_id, [{ selector: '#verification_code', validations: ['req', 'email_token'] }]);
                const req = populateReq();
                FormManager.handleSubmit({
                    form_selector       : withdraw_form_id,
                    obj_request         : req,
                    fnc_response_handler: handleCashierResponse,
                });
            }
        });
    };

    const showCurrency = () => {
        const currencies = Client.get('currencies').split(',');
        currencies.forEach((c) => {
            appendTextValueChild('select_currency', c, c);
        });
        showMessage('choose_currency_message');
        const currency_form_id = '#frm_currency';
        $(currency_form_id).setVisibility(1);
        FormManager.init(currency_form_id, [{ selector: '#select_currency', request_field: 'set_account_currency' }]);
        FormManager.handleSubmit({
            form_selector       : currency_form_id,
            fnc_response_handler: initDepositWithdraw,
        });
    };

    const getCashierType = () => {
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

    const populateReq = (send_verification) => {
        const req = { cashier: cashier_type };
        const verification_code_val = $('#verification_code').val();
        if (verification_code_val) verification_code = verification_code_val;
        if (send_verification && verification_code) req.verification_code = verification_code;
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';
        return req;
    };

    const getCashierURL = () => {
        BinarySocket.send(populateReq(1)).then(response => handleCashierResponse(response));
    };

    const hideAll = (option) => {
        $('#frm_withdraw, #frm_currency, #frm_ukgc, #errors').setVisibility(0);
        if (option) {
            $(option).setVisibility(0);
        }
    };

    const showError = (id, error) => {
        hideAll();
        if (error) $(`#${id}`).text(error);
        showMessage(id, 'errors');
    };

    const showMessage = (id, parent = 'messages') => {
        $(`#${id}`).siblings().setVisibility(0).end()
            .setVisibility(1);
        $(container).find(`#${parent}`).setVisibility(1);
    };

    const showPersonalDetailsError = (details) => {
        const msg_id = 'personal_details_message';
        let error_fields;
        if (details) {
            error_fields = {
                province: 'State/Province',
                country : 'Country',
                city    : 'Town/City',
                street  : 'First line of home address',
                pcode   : 'Postal Code / ZIP',
                phone   : 'Telephone',
                email   : 'Email address',
            };
        }
        const $el = $(`#${msg_id}`);
        const err_msg = template($el.html(), [localize(details ? error_fields[details] : 'details')]);
        $el.html(err_msg);
        showMessage(msg_id);
    };

    const ukgcResponseHandler = (response) => {
        if ('error' in response) {
            showError('custom_error', response.error.message);
        } else {
            getCashierURL();
        }
    };

    const initUKGC = () => {
        const ukgc_form_id = '#frm_ukgc';
        $(ukgc_form_id).setVisibility(1);
        FormManager.init(ukgc_form_id, [
            { request_field: 'ukgc_funds_protection', value: 1 },
            { request_field: 'tnc_approval',          value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : ukgc_form_id,
            fnc_response_handler: ukgcResponseHandler,
        });
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
                case 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET':
                    showError('limits_error');
                    break;
                default:
                    showError('custom_error', error.message);
            }
        } else {
            $(container).find('iframe').attr('src', response.cashier).parent()
                .setVisibility(1);
        }
    };

    const onLoad = () => {
        getCashierType();
        BinarySocket.send({ cashier_password: 1 }).then((data) => {
            if ('error' in data) {
                showError('custom_error', data.error.message);
            } else {
                init(data.cashier_password);
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = DepositWithdraw;
