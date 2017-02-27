const Client               = require('../../base/client').Client;
const localize             = require('../../base/localize').localize;
const url_for              = require('../../base/url').url_for;
const template             = require('../../base/utility').template;
const appendTextValueChild = require('../../common_functions/common_functions').appendTextValueChild;
const elementInnerHtml     = require('../../common_functions/common_functions').elementInnerHtml;
const Content              = require('../../common_functions/content').Content;
const FormManager          = require('../../common_functions/form_manager');

const DepositWithdraw = (function() {
    'use strict';

    let cashier_type;

    const init = function(cashier_password) {
        if (cashier_password === 1) {
            showMessage('cashier-locked-message');
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
            showError(response.error.message);
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
                showError(response.error.message);
            } else {
                showMessage('check-email-message');
                const withdraw_form_id = '#withdraw-form';
                $(withdraw_form_id).removeClass('invisible');
                FormManager.init(withdraw_form_id, [
                    { selector: '#verification-token', validations: ['req', 'email_token'], request_field: 'verification_code' },
                ]);
                FormManager.handleSubmit(withdraw_form_id, populateReq(), handleCashierResponse);
            }
        });
    };

    const showCurrency = function() {
        const currencies = Client.get('currencies').split(',');
        currencies.forEach(function(c) {
            appendTextValueChild('select-currency', c, c);
        });
        showMessage('choose-currency-message');
        const currency_form_id = '#currency-form';
        $(currency_form_id).removeClass('invisible');
        FormManager.init(currency_form_id, [{ selector: '#select-currency', request_field: 'set_account_currency' }]);
        FormManager.handleSubmit(currency_form_id, {}, commonResponseHandler);
    };

    const getCashierType = function() {
        const deposit_withdraw_heading = document.getElementById('deposit-withdraw-heading');
        const hash_value = window.location.hash;
        if (/withdraw/.test(hash_value)) {
            cashier_type = 'withdraw';
            elementInnerHtml(deposit_withdraw_heading, localize('Withdraw'));
        } else if (/deposit/.test(hash_value)) {
            cashier_type = 'deposit';
            elementInnerHtml(deposit_withdraw_heading, localize('Deposit'));
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
        $('#withdraw-form, #currency-form, #ukgc-funds-protection, #deposit-withdraw-error').addClass('invisible');
        if (option) {
            $(option).addClass('invisible');
        }
    };

    const showError = function(error, id) {
        hideAll();
        if (!id) {
            $('#custom-error').html(error || localize('Sorry, an error occurred while processing your request.'));
        }
        hideParentShowChild('#deposit-withdraw-error', '.error_messages', id || 'custom-error');
    };

    const showErrorMessage = function(id) {
        hideAll();
        hideParentShowChild('#deposit-withdraw-error', '.error_messages', id);
    };

    const showMessage = function(id) {
        hideParentShowChild('#deposit-withdraw-message', '.messages', id);
    };

    const hideParentShowChild = function(parent, children, id) {
        $(parent).find(children).addClass('invisible').end()
            .find('#' + id)
            .removeClass('invisible')
            .end()
            .removeClass('invisible');
    };

    const showPersonalDetailsError = function(details) {
        const msgID = 'personal-details-message';
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
        const ukgc_form_id = '#ukgc-funds-protection';
        $(ukgc_form_id).removeClass('invisible');
        FormManager.init(ukgc_form_id, [{ request_field: 'ukgc_funds_protection', value: 1 }]);
        FormManager.handleSubmit(ukgc_form_id, { tnc_approval: 1 }, commonResponseHandler);
    };

    const handleCashierResponse = (response) => {
        hideAll('#deposit-withdraw-message');
        const error = response.error;
        if (error) {
            hideAll('#deposit-withdraw-message');
            switch (error.code) {
                case 'ASK_TNC_APPROVAL':
                    window.location.href = url_for('user/tnc_approvalws');
                    break;
                case 'ASK_FIX_DETAILS':
                    showPersonalDetailsError(error.details);
                    break;
                case 'ASK_UK_FUNDS_PROTECTION':
                    initUKGC();
                    break;
                case 'ASK_AUTHENTICATE':
                    showMessage('not-authenticated-message');
                    break;
                case 'ASK_FINANCIAL_RISK_APPROVAL':
                    showErrorMessage('financial-risk-error');
                    break;
                case 'ASK_JP_KNOWLEDGE_TEST':
                    showErrorMessage('knowledge-test-error');
                    break;
                case 'JP_NOT_ACTIVATION':
                    showErrorMessage('activation-error');
                    break;
                case 'ASK_AGE_VERIFICATION':
                    showErrorMessage('age-error');
                    break;
                default:
                    showError(error.message);
            }
        } else {
            $('#deposit-withdraw-iframe-container').find('iframe').attr('src', response.cashier).end()
                .removeClass('invisible');
        }
    };

    const onLoad = function() {
        const clientIsVirtual = function() {
            const is_virtual = Client.get('is_virtual');
            if (is_virtual) {
                showError(Content.localize().featureNotRelevantToVirtual);
            }
            return is_virtual;
        };

        BinarySocket.wait('authorize').then(() => {
            Content.populate();
            getCashierType();
            if (clientIsVirtual()) return;
            BinarySocket.wait('get_account_status').then(() => {
                const can_deposit = cashier_type === 'deposit' && !Client.status_detected('cashier_locked, unwelcome', 'any');
                const can_withdraw = cashier_type === 'withdraw' && !Client.status_detected('cashier_locked, withdrawal_locked', 'any');
                if (can_deposit || can_withdraw) {
                    BinarySocket.send({ cashier_password: 1 }).then((response) => {
                        if ('error' in response) {
                            showError(response.error.message);
                        } else {
                            init(response.cashier_password);
                        }
                    });
                }
            });
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = DepositWithdraw;
