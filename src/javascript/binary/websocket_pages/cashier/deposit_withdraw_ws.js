var template = require('../../base/utility').template;
var Validate = require('../../common_functions/validation').Validate;
var Content  = require('../../common_functions/content').Content;
var localize = require('../../base/localize').localize;
var Client   = require('../../base/client').Client;
var url_for  = require('../../base/url').url_for;
var appendTextValueChild = require('../../common_functions/common_functions').appendTextValueChild;

var ForwardWS = (function() {
    function init(cashier_password) {
        Content.populate();

        var submit_currency = document.getElementById('submit-currency'),
            submit_verification = document.getElementById('submit-verification'),
            submit_ukgc_funds_protection = document.getElementById('submit-ukgc-funds-protection');

        submit_currency.addEventListener('click', function() {
            submit_currency.setAttribute('disabled', 'disabled');
            BinarySocket.send({ set_account_currency: $('#select-currency').val() });
        });

        submit_verification.addEventListener('click', function() {
            var verification_token = document.getElementById('verification-token').value,
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
    }

    function initDepositOrWithdraw(cashier_password) {
        if (cashier_password === 1) {
            ForwardWS.showMessage('cashier-locked-message');
            sessionStorage.setItem('cashier_lock_redirect', window.location.href);
            return;
        }
        var cashier_type = ForwardWS.getCashierType();
        if (cashier_type === 'withdraw') {
            initWithdrawForm();
        } else if (cashier_type === 'deposit') {
            initDepositForm();
        }
    }

    function initWithdrawForm() {
        BinarySocket.send({
            verify_email: Client.get_value('email'),
            type        : 'payment_withdraw',
        });
        ForwardWS.showMessage('check-email-message');
        $('#withdraw-form').show();
    }

    function initDepositForm() {
        if (Client.get_value('currency')) {
            ForwardWS.getCashierURL();
        } else {
            ForwardWS.showCurrency();
        }
    }

    function showCurrency() {
        var currencies = Client.get_value('currencies').split(',');
        currencies.forEach(function(c) {
            appendTextValueChild('select-currency', c, c);
        });
        ForwardWS.showMessage('choose-currency-message');
        $('#currency-form').show();
    }

    function getCashierType() {
        var cashier_type,
            deposit_withdraw_heading = document.getElementById('deposit-withdraw-heading'),
            hash_value = window.location.hash;
        if (/withdraw/.test(hash_value)) {
            cashier_type = 'withdraw';
            deposit_withdraw_heading.innerHTML = localize('Withdraw');
        } else if (/deposit/.test(hash_value)) {
            cashier_type = 'deposit';
            deposit_withdraw_heading.innerHTML = localize('Deposit');
        }
        return cashier_type;
    }

    function getCashierURL(verification_token) {
        var req = { cashier: getCashierType() };
        if (verification_token) req.verification_code = verification_token;
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';
        BinarySocket.send(req);
    }

    function hideAll(option) {
        $('#withdraw-form').hide();
        $('#currency-form').hide();
        $('#ukgc-funds-protection').hide();
        $('#deposit-withdraw-error').hide();
        if (option) {
            $(option).hide();
        }
    }

    function showError(error, id) {
        hideAll();
        var $deposit_withdraw_error = $('#deposit-withdraw-error');
        $deposit_withdraw_error.find('.error_messages').hide();
        if (id) {
            $deposit_withdraw_error.find('#' + id).show();
        } else {
            $('#custom-error').html(error || localize('Sorry, an error occurred while processing your request.'))
                .show();
        }
        $deposit_withdraw_error.show();
    }

    function showMessage(id) {
        $('#deposit-withdraw-message').find('.messages').hide().end()
            .find('#' + id)
            .show()
            .end()
            .show();
    }

    function showPersonalDetailsError(details) {
        var msgID = 'personal-details-message',
            errorFields;
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
        var errMsg = template($('#' + msgID).html(), [localize(details ? errorFields[details] : 'details')]);
        $('#' + msgID).html(errMsg);
        ForwardWS.showMessage(msgID);
    }

    function checkOnLoad() {
        function clientIsVirtual() {
            var is_virtual = Client.get_boolean('is_virtual');
            if (is_virtual) {
                ForwardWS.showError(localize('This feature is not relevant to virtual-money accounts.'));
            }
            return is_virtual;
        }
        if (clientIsVirtual()) return;
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (!response || clientIsVirtual()) return;
                var type = response.msg_type,
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
                                        window.location.href = url_for('user/tnc_approvalws');
                                        break;
                                    case 'ASK_FIX_DETAILS':
                                        ForwardWS.showPersonalDetailsError(error.details);
                                        break;
                                    case 'ASK_UK_FUNDS_PROTECTION':
                                        $('#ukgc-funds-protection').show();
                                        break;
                                    case 'ASK_AUTHENTICATE':
                                        ForwardWS.showMessage('not-authenticated-message');
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
                            .show();
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
        if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({
                get_account_status: 1,
                passthrough       : { dispatch_to: 'ForwardWS' },
            });
        } else if (
            (!Client.status_detected('cashier_locked, unwelcome', 'any') &&
            /deposit/.test(window.location.hash)) ||
            (!Client.status_detected('cashier_locked, withdrawal_locked', 'any') &&
            /withdraw/.test(window.location.hash))
        ) {
            BinarySocket.send({ cashier_password: 1 });
        }
    }
    return {
        init                    : init,
        getCashierType          : getCashierType,
        getCashierURL           : getCashierURL,
        hideAll                 : hideAll,
        showError               : showError,
        showMessage             : showMessage,
        checkOnLoad             : checkOnLoad,
        showPersonalDetailsError: showPersonalDetailsError,
        showCurrency            : showCurrency,
    };
})();

module.exports = {
    ForwardWS: ForwardWS,
};
