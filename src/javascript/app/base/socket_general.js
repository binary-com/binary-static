const Client               = require('./client');
const Clock                = require('./clock');
const GTM                  = require('./gtm');
const Header               = require('./header');
const Login                = require('./login');
const BinarySocket         = require('./socket');
const Dialog               = require('../common/attach_dom/dialog');
const showPopup            = require('../common/attach_dom/popup');
const setCurrencies        = require('../common/currency').setCurrencies;
const SessionDurationLimit = require('../common/session_duration_limit');
const updateBalance        = require('../pages/user/update_balance');
const State                = require('../../_common/storage').State;
const urlFor               = require('../../_common/url').urlFor;
const getPropertyValue     = require('../../_common/utility').getPropertyValue;

const BinarySocketGeneral = (() => {
    const onOpen = (is_ready) => {
        Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                if (!Client.isValidLoginid()) {
                    Client.sendLogoutRequest();
                    return;
                }
                BinarySocket.send({ website_status: 1, subscribe: 1 });
            }
            Clock.startClock();
        }
    };

    const onMessage = (response) => {
        Header.hideNotification('CONNECTION_ERROR');
        let is_available = false;
        switch (response.msg_type) {
            case 'website_status':
                if (response.website_status) {
                    is_available = /^up$/i.test(response.website_status.site_status);
                    if (is_available && !BinarySocket.availability()) {
                        window.location.reload();
                    } else if (!is_available) {
                        Header.displayNotification(response.website_status.message, true);
                    }
                    BinarySocket.availability(is_available);
                    setCurrencies(response.website_status);
                }
                break;
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        Dialog.alert({ id: 'authorize_error_alert', message: response.error.message });
                    }
                    Client.sendLogoutRequest(is_active_tab);
                } else if (!Login.isLoginPages() && !/authorize/.test(State.get('skip_response'))) {
                    if (response.authorize.loginid !== Client.get('loginid')) {
                        Client.sendLogoutRequest(true);
                    } else {
                        Client.responseAuthorize(response);
                        BinarySocket.send({ balance: 1, subscribe: 1 });
                        BinarySocket.send({ get_settings: 1 });
                        BinarySocket.send({ get_account_status: 1 });
                        BinarySocket.send({ payout_currencies: 1 });
                        BinarySocket.send({ mt5_login_list: 1 });
                        setResidence(response.authorize.country || Client.get('residence'));
                        if (!Client.get('is_virtual')) {
                            BinarySocket.send({ get_self_exclusion: 1 });
                        }
                        BinarySocket.sendBuffered();
                        if (/bch/i.test(response.authorize.currency) && !Client.get('accepted_bch')) {
                            showPopup({
                                url        : urlFor('user/warning'),
                                popup_id   : 'warning_popup',
                                form_id    : '#frm_warning',
                                content_id : '#warning_content',
                                validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
                                onAccept   : () => { Client.set('accepted_bch', 1); },
                            });
                        }
                    }
                }
                break;
            case 'balance':
                updateBalance(response);
                break;
            case 'logout':
                Client.doLogout(response);
                break;
            case 'landing_company':
                Header.upgradeMessageVisibility();
                if (!response.error) {
                    Header.metatraderMenuItemVisibility();
                }
                break;
            case 'get_self_exclusion':
                SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    Client.set('email', response.get_settings.email);
                    GTM.eventHandler(response.get_settings);
                    if (response.get_settings.is_authenticated_payment_agent) {
                        $('#topMenuPaymentAgent').setVisibility(1);
                    }
                }
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            Client.set('residence', residence);
            BinarySocket.send({ landing_company: residence });
        }
    };

    const initOptions = () => ({
        onOpen,
        onMessage,
        notify        : Header.displayNotification,
        isLoggedIn    : Client.isLoggedIn,
        getClientValue: Client.get,
    });

    return {
        initOptions,
    };
})();

module.exports = BinarySocketGeneral;
