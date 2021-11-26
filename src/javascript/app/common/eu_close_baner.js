const getElementById = require('../../_common/common_functions').getElementById;
const BinarySocket = require('../base/socket');
const Client = require('../base/client');
const State = require('../../_common/storage').State;
const isEuCountry   = require('../common/country_base').isEuCountry;

const EuCloseBanner = (() => {
    let el_close_banner_container, el_gaming_popup, el_learn_more;
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const is_be_client = (Client.get('residence') === 'be' || State.getResponse('website_status.clients_country') === 'be');
            if (isEuCountry() || (is_be_client && Client.hasAccountType('gaming'))) {
                el_gaming_popup = getElementById('eu-close-popup');
                el_close_banner_container = getElementById('eu_close_banner_container');
                el_close_banner_container.setVisibility(1);
                el_learn_more = getElementById('eu_close_banner_btn');
            }
            el_learn_more.addEventListener('click', onShowPopup);
        });

    };

    const onShowPopup = () => {
        el_gaming_popup.setVisibility(1);
        const el_top_bar = getElementById('topbar');
        const top_popup = getElementById('top_popup');
        el_top_bar.style.zIndex = 0;
        document.body.style.overflow = 'hidden';
        top_popup.scrollLeft = 0;
        top_popup.scrollTop = 0;
    };

    return { onLoad, onShowPopup };

})();

module.exports = EuCloseBanner;
