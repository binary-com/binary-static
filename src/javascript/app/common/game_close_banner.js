const getElementById = require('../../_common/common_functions').getElementById;
const BinarySocket = require('../base/socket');
const Client = require('../base/client');
const State = require('../../_common/storage').State;

const CloseBanner = (() => {

    let el_close_banner_container, el_gaming_popup, el_learn_more;

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const is_uk_residence = (Client.get('residence') === 'gb' || State.getResponse('website_status.clients_country') === 'gb');
            const is_iom_client = (Client.get('residence') === 'im' || State.getResponse('website_status.clients_country') === 'im');
            const client_account = Client.get('landing_company_shortcode') === 'maltainvest';

            if (is_uk_residence && !client_account) {
                el_gaming_popup = getElementById('gaming-close-popup');
                el_close_banner_container = getElementById('close_banner_container');
                el_close_banner_container.setVisibility(1);
                el_learn_more = getElementById('close_banner_btn');
                el_learn_more.addEventListener('click', onShowPopup);
            } else if (is_iom_client && !client_account) {
                el_gaming_popup = getElementById('gaming-close-popup-iom');
                el_close_banner_container = getElementById('close_banner_container_iom');
                el_close_banner_container.setVisibility(1);
                el_learn_more = getElementById('close_banner_btn_iom');
                el_learn_more.addEventListener('click', onShowPopup);
            }
        });

    };

    const onShowPopup = () => {
        el_gaming_popup.setVisibility(1);
        const el_top_bar = getElementById('topbar');
        el_top_bar.style.zIndex = 0;
        document.body.style.overflow = 'hidden';
    };

    return { onLoad, onShowPopup };

})();

module.exports = CloseBanner;
