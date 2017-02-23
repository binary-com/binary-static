const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const localize             = require('../../base/localize').localize;
const template             = require('../../base/utility').template;
const appendTextValueChild = require('../../common_functions/common_functions').appendTextValueChild;
const elementInnerHtml     = require('../../common_functions/common_functions').elementInnerHtml;
const Validate             = require('../../common_functions/validation').Validate;

const ForwardWS = (function() {
    const init = function(cashier_password) {
        const submit_currency = document.getElementById('submit-currency'),
            submit_verification = document.getElementById('submit-verification'),
            submit_ukgc_funds_protection = document.getElementById('submit-ukgc-funds-protection');

        submit_currency.addEventListener('click', function() {
            submit_currency.setAttribute('disabled', 'disabled');
            BinarySocket.send({ set_account_currency: $('#select-currency').val() });
        });

        submit_verification.addEventListener('click', function() {
            const verification_token = document.getElementById('verification-token').value,
                verification_error = document.getElementById('verification-error');
            if (!Validate.errorMessageToken(verification_token, verification_error)) {
                submit_verification.setAttribute('disabled', 'disabled');
                getCashierURL(verification_token);
            }
        });

        submit_ukgc_funds_protection.addEventListener('click', function() {
            submit_ukgc_funds_protection.setAttribute('disabled', 'disabled');
            BinarySocket.send({
                tnc_approval         : 1,
                ukgc_funds_protection: 1,
            });
        });

        initDepositOrWithdraw(cashier_password);
    };

    const initDepositOrWithdraw = function(cashier_password) {
        if (cashier_password === 1) {
            ForwardWS.showMessage('cashier-locked-message');
            sessionStorage.setItem('cashier_lock_redirect', window.location.href);
            return;
        }
        const cashier_type = ForwardWS.getCashierType();
        if (cashier_type === 'withdraw') {
            initWithdrawForm();
        } else if (cashier_type === 'deposit') {
            initDepositForm();
        }
    };

    const initWithdrawForm = function() {
        BinarySocket.send({
            verify_email: Client.get('email'),
            type        : 'payment_withdraw',
        });
        ForwardWS.showMessage('check-email-message');
        $('#withdraw-form').removeClass('invisible');
    };

    const initDepositForm = function() {
        if (Client.get('currency')) {
            ForwardWS.getCashierURL();
        } else {
            ForwardWS.showCurrency();
        }
    };

    const showCurrency = function() {
        const currencies = Client.get('currencies').split(',');
        currencies.forEach(function(c) {
            appendTextValueChild('select-currency', c, c);
        });
        ForwardWS.showMessage('choose-currency-message');
        $('#currency-form').removeClass('invisible');
    };

    const getCashierType = function() {
        let cashier_type;
        const deposit_withdraw_heading = document.getElementById('deposit-withdraw-heading'),
            hash_value = window.location.hash;
        if (/withdraw/.test(hash_value)) {
            cashier_type = 'withdraw';
            elementInnerHtml(deposit_withdraw_heading, localize('Withdraw'));
        } else if (/deposit/.test(hash_value)) {
            cashier_type = 'deposit';
            elementInnerHtml(deposit_withdraw_heading, localize('Deposit'));
        }
        return cashier_type;
    };

    const getCashierURL = function(verification_token) {
        const req = { cashier: getCashierType() };
        if (verification_token) req.verification_code = verification_token;
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';
        BinarySocket.send(req);
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
        ForwardWS.showMessage(msgID);
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (!response) return;
                const type = response.msg_type,
                    error = response.error;

                if (error) {
                    switch (type) {
                        case 'cashier_password':
                        case 'set_account_currency':
                        case 'tnc_approval':
                            ForwardWS.showError(error.message);
                            break;
                        case 'cashier':
                            ForwardWS.hideAll('#deposit-withdraw-message');
                            if (error.code) {
                                switch (error.code) {
                                    case 'ASK_TNC_APPROVAL':
                                        BinaryPjax.load('user/tnc_approvalws');
                                        break;
                                    case 'ASK_FIX_DETAILS':
                                        ForwardWS.showPersonalDetailsError(error.details);
                                        break;
                                    case 'ASK_UK_FUNDS_PROTECTION':
                                        $('#ukgc-funds-protection').removeClass('invisible');
                                        break;
                                    case 'ASK_AUTHENTICATE':
                                        ForwardWS.showMessage('not-authenticated-message');
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
                                        ForwardWS.showError(error.message);
                                }
                            } else {
                                ForwardWS.showError(error.message);
                            }
                            break;
                        default:
                            ForwardWS.showError(error.message);
                    }
                    return;
                }
                // if we are here we can assume there was no error
                switch (type) {
                    case 'cashier_password':
                        ForwardWS.init(response.cashier_password);
                        break;
                    case 'cashier':
                        ForwardWS.hideAll('#deposit-withdraw-message');
                        $('#deposit-withdraw-iframe-container').find('iframe').attr('src', response.cashier).end()
                            .removeClass('invisible');
                        break;
                    case 'set_account_currency':
                    case 'tnc_approval':
                        ForwardWS.getCashierURL();
                        break;
                    default:
                        break;
                }
            },
        });
        const hash = window.location.hash,
            deposit_locked = /deposit/.test(hash) && Client.status_detected('cashier_locked, unwelcome', 'any'),
            withdraw_locked = /withdraw/.test(hash) && Client.status_detected('cashier_locked, withdrawal_locked', 'any');
        if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({
                get_account_status: 1,
                passthrough       : { dispatch_to: 'ForwardWS' },
            });
        } else if (!deposit_locked && !withdraw_locked) {
            BinarySocket.send({ cashier_password: 1 });
        }
    };
    return {
        onLoad                  : onLoad,
        init                    : init,
        getCashierType          : getCashierType,
        getCashierURL           : getCashierURL,
        hideAll                 : hideAll,
        showError               : showError,
        showMessage             : showMessage,
        showPersonalDetailsError: showPersonalDetailsError,
        showCurrency            : showCurrency,
    };
})();

module.exports = ForwardWS;
