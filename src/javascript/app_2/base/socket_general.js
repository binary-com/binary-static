import { action, flow }     from 'mobx';
import WS                   from '../data/ws_methods';
import Client               from '../../_common/base/client_base';
import { setCurrencies }    from '../../_common/base/currency_base';
import Login                from '../../_common/base/login';
import ServerTime           from '../../_common/base/server_time';
import BinarySocket         from '../../_common/base/socket_base';
import { State }            from '../../_common/storage';
import { getPropertyValue } from '../../_common/utility';

let client_store,
    common_store;

// TODO: update commented statements to the corresponding functions from app_2
const BinarySocketGeneral = (() => {
    const onOpen = (is_ready) => {
        // Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                if (!Client.isValidLoginid()) {
                    Client.sendLogoutRequest();
                    return;
                }
                WS.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
            }
            ServerTime.init(action('setTime', () => { common_store.server_time = ServerTime.get(); }));
        }
    };

    const onMessage = (response) => {
        handleError(response);
        // Header.hideNotification('CONNECTION_ERROR');
        switch (response.msg_type) {
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        // Dialog.alert({ id: 'authorize_error_alert', message: response.error.message });
                    }
                    Client.sendLogoutRequest(is_active_tab);
                } else if (!Login.isLoginPages() && !/authorize/.test(State.get('skip_response'))) {
                    if (response.authorize.loginid !== Client.get('loginid')) {
                        Client.sendLogoutRequest(true);
                    } else {
                        Client.responseAuthorize(response);
                        setBalance(response.authorize.balance);
                        WS.subscribeBalance(ResponseHandlers.balance);
                        WS.getSettings();
                        WS.getAccountStatus();
                        WS.payoutCurrencies();
                        WS.mt5LoginList();
                        setResidence(response.authorize.country || Client.get('residence'));
                        if (!Client.get('is_virtual')) {
                            WS.getSelfExclusion();
                        }
                        BinarySocket.sendBuffered();
                        if (/bch/i.test(response.authorize.currency) && !Client.get('accepted_bch')) {
                            // showPopup({
                            //     url        : urlFor('user/warning'),
                            //     popup_id   : 'warning_popup',
                            //     form_id    : '#frm_warning',
                            //     content_id : '#warning_content',
                            //     validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
                            //     onAccept   : () => { Client.set('accepted_bch', 1); },
                            // });
                        }
                    }
                }
                break;
            case 'landing_company':
                // Header.upgradeMessageVisibility();
                break;
            case 'get_self_exclusion':
                // SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    Client.set('email', response.get_settings.email);
                    // GTM.eventHandler(response.get_settings);
                    // if (response.get_settings.is_authenticated_payment_agent) {
                    //     $('#topMenuPaymentAgent').setVisibility(1);
                    // }
                }
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            Client.set('residence', residence);
            WS.landingCompany(residence);
        }
    };

    const setBalance = flow(function* (balance) {
        yield BinarySocket.wait('website_status');
        Client.set('balance', balance);
        client_store.balance = balance;
    });

    const handleError = (response) => {
        const msg_type   = response.msg_type;
        const error_code = getPropertyValue(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
            case 'InternalServerError':
            case 'OutputValidationFailed': {
                if (msg_type !== 'mt5_login_list') {
                    // showNoticeMessage(response.error.message);
                }
                break;
            }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    // Header.displayNotification(localize('You have reached the rate limit of requests per second. Please try later.'), true, 'RATE_LIMIT');
                }
                break;
            case 'InvalidAppID':
                // Header.displayNotification(response.error.message, true, 'INVALID_APP_ID');
                break;
            case 'DisabledClient':
                // showNoticeMessage(response.error.message);
                break;
            // no default
        }
    };

    const init = (store) => {
        client_store = store.client;
        common_store = store.common;

        return {
            onOpen,
            onMessage,
        };
    };

    return {
        init,
        setBalance,
    };
})();

export default BinarySocketGeneral;

const ResponseHandlers = (() => {
    let is_available = false;
    const websiteStatus = (response) => {
        if (response.website_status) {
            is_available = /^up$/i.test(response.website_status.site_status);
            if (is_available && !BinarySocket.availability()) {
                window.location.reload();
                return;
            }
            if (response.website_status.message) {
                // Footer.displayNotification(response.website_status.message);
            } else {
                // Footer.clearNotification();
            }
            BinarySocket.availability(is_available);
            setCurrencies(response.website_status);
        }
    };

    const balance = (response) => {
        if (!response.error){
            BinarySocketGeneral.setBalance(response.balance.balance);
        }
    };

    return {
        websiteStatus,
        balance,
    };
})();
