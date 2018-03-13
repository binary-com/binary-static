const setShouldRedirect = require('../user/account/settings/cashier_password').setShouldRedirect;
const BinaryPjax        = require('../../base/binary_pjax');
const Client            = require('../../base/client');
const BinarySocket      = require('../../base/socket');
const showPopup         = require('../../common/attach_dom/popup');
const Currency          = require('../../common/currency');
const FormManager       = require('../../common/form_manager');
const validEmailToken   = require('../../common/form_validation').validEmailToken;
const getElementById    = require('../../../_common/common_functions').getElementById;
const localize          = require('../../../_common/localize').localize;
const State             = require('../../../_common/storage').State;
const toTitleCase       = require('../../../_common/string_util').toTitleCase;
const Url               = require('../../../_common/url');
const template          = require('../../../_common/utility').template;

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
        token = Url.getHashValue('token');
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
        const $heading = $(container).find('#heading');
        const action   = Url.param('action');
        if (/^(withdraw|deposit)$/.test(action)) {
            cashier_type = action;
            $heading.text(`${localize(toTitleCase(action))} ${Client.get('currency') || ''}`);
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

    const getCashierURL = (bch_has_confirmed) => {
        if (!/^BCH/.test(Client.get('currency')) || bch_has_confirmed || Client.get('cashier_confirmed')) {
            BinarySocket.send(populateReq()).then(response => handleCashierResponse(response));
        } else {
            showPopup({
                url               : Url.urlFor('cashier/confirmation'),
                popup_id          : 'confirm_popup',
                form_id           : '#frm_confirm',
                content_id        : '#confirm_content',
                validations       : [{ selector: '#chk_confirm', validations: [['req', { hide_asterisk: true }]] }],
                additionalFunction: () => {
                    const el_cancel = getElementById('cancel');
                    const el_popup  = getElementById('confirm_popup');
                    el_cancel.addEventListener('click', () => {
                        if (el_popup) {
                            el_popup.remove();
                        }
                        BinaryPjax.load(Client.defaultRedirectUrl());
                    });
                },
                onAccept: () => {
                    Client.set('cashier_confirmed', 1);
                    getCashierURL(1);
                },
            });
        }
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
            if (Currency.isCryptocurrency(Client.get('currency'))) {
                $iframe.css('height', '700px');
            }
            if (/^BCH/.test(Client.get('currency'))) {
                getElementById('message_bitcoin_cash').setVisibility(1);
            }
            $iframe.attr('src', response.cashier).parent().setVisibility(1);
        }
    };

    const onLoad = () => {
        getCashierType();
        const req_cashier_password   = BinarySocket.send({ cashier_password: 1 });
        const req_get_account_status = BinarySocket.send({ get_account_status: 1 });

        Promise.all([req_cashier_password, req_get_account_status]).then(() => {
            // cannot use State.getResponse because we want to check error which is outside of response[msg_type]
            const response_cashier_password   = State.get(['response', 'cashier_password']);
            const response_get_account_status = State.get(['response', 'get_account_status']);
            if ('error' in response_cashier_password) {
                showError('custom_error', response_cashier_password.error.message);
            } else if (response_cashier_password.cashier_password === 1) {
                showMessage('cashier_locked_message'); // Locked by client
            } else if (!response_get_account_status.error && /cashier_locked/.test(response_get_account_status.get_account_status.status)) {
                showError('custom_error', localize('Your cashier is locked.')); // Locked from BO
            } else {
                const limit = State.getResponse('get_limits.remainder');
                if (cashier_type === 'withdraw' && typeof limit !== 'undefined' && +limit < Currency.getMinWithdrawal(Client.get('currency'))) {
                    showError('custom_error', localize('You have reached the withdrawal limit.'));
                } else {
                    BinarySocket.wait('get_settings').then(() => {
                        init(response_cashier_password.cashier_password);
                    });
                }
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = DepositWithdraw;
