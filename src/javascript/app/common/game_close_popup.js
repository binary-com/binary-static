const getElementById = require('../../_common/common_functions').getElementById;
const BinarySocket = require('../base/socket');
const Client = require('../base/client');
const State = require('../../_common/storage').State;

const ClosePopup = (() => {
    let el_gaming_popup, el_accept_btn;

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const is_uk_residence = (Client.get('residence') === 'gb' || State.getResponse('website_status.clients_country') === 'gb');
            const is_iom_client = (Client.get('residence') === 'im' || State.getResponse('website_status.clients_country') === 'im');
            if (is_uk_residence) {
                el_gaming_popup = getElementById('gaming-close-popup');
                el_accept_btn = getElementById('accept-btn');
            } else if (is_iom_client) {
                el_gaming_popup = getElementById('gaming-close-popup-iom');
                el_accept_btn = getElementById('accept-btn-iom');
            }
            el_gaming_popup.setVisibility(0);
            el_accept_btn.addEventListener('click', onClosePopup);
        });
    };
    const loginOnLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const is_uk_residence = (Client.get('residence') === 'gb' || State.getResponse('website_status.clients_country') === 'gb');
            const is_iom_client = (Client.get('residence') === 'im' || State.getResponse('website_status.clients_country') === 'im');
            const client_account = Client.get('landing_company_shortcode') === 'malta' || Client.get('landing_company_shortcode') === 'iom';

            if (is_uk_residence && client_account) {
                el_gaming_popup = getElementById('gaming-close-popup');
                el_accept_btn = getElementById('accept-btn');
                el_gaming_popup.setVisibility(1);
            } else if (is_iom_client && client_account) {
                el_gaming_popup = getElementById('gaming-close-popup-iom');
                el_accept_btn = getElementById('accept-btn-iom');
                el_gaming_popup.setVisibility(1);
            }
            
            el_accept_btn.addEventListener('click', onClosePopup);
        });
    };

    const onClosePopup = () => {
        el_gaming_popup.setVisibility(0);
        const el_top_bar = getElementById('topbar');
        el_top_bar.style.zIndex = 4;
        document.body.style.overflow = 'auto';
    };

    return { loginOnLoad, onLoad, onClosePopup };

})();

module.exports = ClosePopup;
