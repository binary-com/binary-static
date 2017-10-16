const BinarySocket      = require('../socket');
const setShouldRedirect = require('../user/account/settings/cashier_password').setShouldRedirect;
const BinaryPjax        = require('../../base/binary_pjax');
const Client            = require('../../base/client');
const localize          = require('../../base/localize').localize;
const Url               = require('../../base/url');
const template          = require('../../base/utility').template;
const FormManager       = require('../../common_functions/form_manager');
const isCryptocurrency  = require('../../common_functions/currency').isCryptocurrency;
const validEmailToken   = require('../../common_functions/form_validation').validEmailToken;

const DepositWithdraw = (() => {
    let cashier_type,
        token;

    const container = '#deposit_withdraw';

    const init = (cashier_password) => {
        if (cashier_password) {
            showMessage('cashier_locked_message');
            setShouldRedirect(true);
            return;
        }

        if (!Client.get('currency')) {
            BinaryPjax.load(`${Url.urlFor('user/set-currency')}#redirect_${cashier_type}`);
            return;
        }

        if (cashier_type === 'deposit') {
            token = '';
            getCashierURL();
        } else if (cashier_type === 'withdraw') {
            checkToken();
        }
    };

    const checkToken = () => {
        token = Url.param('token') || '';
        if (!token) {
            BinarySocket.send({
                verify_email: Client.get('email'),
                type        : 'payment_withdraw',
            }).then((response_withdraw) => {
                if ('error' in response_withdraw) {
                    showError('custom_error', response_withdraw.error.message);
                } else {
                    showMessage('check_email_message');
                }
            });
        } else if (!validEmailToken(token)) {
            showError('token_error');
        } else {
            getCashierURL();
        }
    };

    const getCashierType = () => {
        const $heading   = $(container).find('#heading');
        const hash_value = window.location.hash;
        if (/withdraw/.test(hash_value)) {
            cashier_type = 'withdraw';
            $heading.text(localize('Withdraw'));
        } else if (/deposit/.test(hash_value)) {
            cashier_type = 'deposit';
            $heading.text(localize('Deposit'));
        }
    };

    const populateReq = () => {
        const req = { cashier: cashier_type };
        if (token) {
            req.verification_code = token;
        }
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';

        return req;
    };

    const getCashierURL = () => {
        BinarySocket.send(populateReq()).then(response => handleCashierResponse(response));
    };

    const hideAll = (option) => {
        $('#frm_withdraw, #frm_ukgc, #errors').setVisibility(0);
        if (option) {
            $(option).setVisibility(0);
        }
    };

    const showError = (id, error) => {
        hideAll();
        showMessage(id, error, 'errors');
    };

    const showMessage = (id, message, parent = 'messages') => {
        const $element = $(`#${id}`);
        if (message) {
            $element.text(message);
        }
        $element.siblings().setVisibility(0).end()
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
        const $el     = $(`#${msg_id}`);
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
                case 'ASK_EMAIL_VERIFY':
                    checkToken();
                    break;
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
                    showMessage('not_authenticated_message', error.message);
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
            const $iframe = $(container).find('iframe');
            if (isCryptocurrency(Client.get('currency'))) {
                $iframe.css('height', '700px');
            }
            if (/^BCH/.test(Client.get('currency'))) {
                document.getElementById('message_bitcoin_cash').setVisibility(1);
            }
            $iframe.attr('src', response.cashier).parent().setVisibility(1);
        }
    };

    const onLoad = () => {
        getCashierType();
        BinarySocket.send({ cashier_password: 1 }).then((response) => {
            if ('error' in response) {
                showError('custom_error', response.error.message);
            } else {
                init(response.cashier_password);
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = DepositWithdraw;
