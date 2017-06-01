const BinarySocket         = require('./socket');
const updateBalance        = require('./user/update_balance');
const Client               = require('../base/client');
const Clock                = require('../base/clock');
const GTM                  = require('../base/gtm');
const Header               = require('../base/header');
const Login                = require('../base/login');
const getPropertyValue     = require('../base/utility').getPropertyValue;
const jpResidence          = require('../common_functions/country_base').jpResidence;
const SessionDurationLimit = require('../common_functions/session_duration_limit');
const Cookies              = require('../../lib/js-cookie');

const BinarySocketGeneral = (() => {
    'use strict';

    const onOpen = (is_ready) => {
        Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                Client.validateLoginid();
                BinarySocket.send({ website_status: 1, subscribe: 1 });
            }
            Clock.startClock();
        }
    };

    const onMessage = (response) => {
        Header.hideNotification('CONNECTION_ERROR');
        let is_available;
        switch (response.msg_type) {
            case 'website_status':
                is_available = /^up$/i.test(response.website_status.site_status);
                if (is_available && !BinarySocket.availability()) {
                    window.location.reload();
                } else if (!is_available) {
                    Header.displayNotification(response.website_status.message, true);
                }
                BinarySocket.availability(is_available);
                break;
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        window.alert(response.error.message);
                    }
                    Client.sendLogoutRequest(is_active_tab);
                } else if (response.authorize.loginid !== Cookies.get('loginid')) {
                    Client.sendLogoutRequest(true);
                } else {
                    if (!Login.isLoginPages()) {
                        Client.responseAuthorize(response);
                        BinarySocket.send({ balance: 1, subscribe: 1 });
                        BinarySocket.send({ get_settings: 1 });
                        BinarySocket.send({ get_account_status: 1 });
                        BinarySocket.send({ payout_currencies: 1 });
                        BinarySocket.send({ mt5_login_list: 1 });
                        setResidence(response.authorize.country || Cookies.get('residence'));
                        if (!Client.get('is_virtual') && !jpResidence()) {
                            BinarySocket.send({ get_self_exclusion: 1 });
                            // TODO: remove this when back-end adds it as a status to get_account_status
                            BinarySocket.send({ get_financial_assessment: 1 });
                        }
                    }
                    BinarySocket.sendBuffered();
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
                    // Header.metatraderMenuItemVisibility(response); // to be uncommented once MetaTrader launched
                    const company = Client.currentLandingCompany();
                    if (company) {
                        Client.set('default_currency', company.legal_default_currency);
                    }
                }
                break;
            case 'get_self_exclusion':
                SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'payout_currencies':
                Client.set('currencies', response.payout_currencies.join(','));
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    GTM.eventHandler(response.get_settings);
                    if (response.get_settings.is_authenticated_payment_agent) {
                        $('#topMenuPaymentAgent').setVisibility(1);
                    }
                    Client.set('first_name', response.get_settings.first_name);
                }
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            Client.setCookie('residence', residence);
            Client.set('residence', residence);
            BinarySocket.send({ landing_company: residence });
        }
    };

    const initOptions = () => ({
        onOpen      : onOpen,
        onMessage   : onMessage,
        notify      : Header.displayNotification,
        is_logged_in: Client.isLoggedIn(),
    });

    return {
        initOptions: initOptions,
    };
})();

module.exports = BinarySocketGeneral;
