const getElementById = require('../../_common/common_functions').getElementById;
const createElement  = require('../../_common/utility').createElement;

const banner_types = {
    rebranding: 'rebranding',
    multiplier: 'multiplier',
};

const DerivBanner = (() => {
    let el_rebranding_banner_container,
        el_multiplier_banner_container,
        el_banner_to_show,
        el_close_button,
        deriv_banner_type;

    const onLoad = () => {
        const is_deriv_banner_dismissed = localStorage.getItem('is_deriv_banner_dismissed');

        if (!is_deriv_banner_dismissed) {
            el_rebranding_banner_container = getElementById('deriv_banner_container');
            el_multiplier_banner_container = getElementById('multiplier_banner_container');
            deriv_banner_type = localStorage.getItem('deriv_banner_type');

            showBanner();
            el_close_button = el_banner_to_show.querySelector('.deriv_banner_close') || createElement('div');
            el_close_button.addEventListener('click', onClose);
        }
    };

    const onClose = () => {
        el_banner_to_show.setVisibility(0);
        localStorage.setItem('is_deriv_banner_dismissed', 1);
    };

    const showBanner = () => {
        if (deriv_banner_type === banner_types.rebranding) {
            el_banner_to_show = el_rebranding_banner_container;
        } else {
            el_banner_to_show = el_multiplier_banner_container;
        }
        el_banner_to_show.setVisibility(1);
    };

    const chooseBanner = () => {
        if (localStorage.getItem('deriv_banner_type')) {
            return;
        }

        const banner_type = Math.random() < 0.5 ? banner_types.rebranding : banner_types.multiplier;

        localStorage.setItem('deriv_banner_type', banner_type);
    };

    const onUnload = () => {
        if (el_close_button) {
            el_close_button.removeEventListener('click', onClose);
        }
    };

    return {
        chooseBanner,
        onLoad,
        onUnload,
    };
})();

module.exports = DerivBanner;
