const getElementById = require('../../_common/common_functions').getElementById;
const createElement  = require('../../_common/utility').createElement;

const DerivBanner = (() => {
    let el_multiplier_banner_container,
        el_close_button;

    const onLoad = () => {
        const is_deriv_banner_dismissed = localStorage.getItem('is_deriv_banner_dismissed');

        if (!is_deriv_banner_dismissed) {
            el_multiplier_banner_container = getElementById('multiplier_banner_container');
            el_multiplier_banner_container.setVisibility(1);
            el_close_button = el_multiplier_banner_container.querySelector('.deriv_banner_close') || createElement('div');
            el_close_button.addEventListener('click', onClose);
        }
    };

    const onClose = () => {
        el_multiplier_banner_container.setVisibility(0);
        localStorage.setItem('is_deriv_banner_dismissed', 1);
    };

    const onUnload = () => {
        if (el_close_button) {
            el_close_button.removeEventListener('click', onClose);
        }
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = DerivBanner;
