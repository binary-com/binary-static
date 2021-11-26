const getElementById = require('../../_common/common_functions').getElementById;

const EuClosePopup = (() => {
    let el_gaming_popup, el_accept_btn;

    // const onLoad = () => {
    //     el_gaming_popup = getElementById('eu-close-popup');
    //     el_accept_btn = getElementById('accept-btn');
    //     el_gaming_popup.setVisibility(0);
    //     el_accept_btn.addEventListener('click', onClosePopup);
    // };
    const loginOnLoad = () => {
        el_gaming_popup = getElementById('eu-close-popup');
        el_accept_btn = getElementById('eu-accept-btn');
        el_gaming_popup.setVisibility(1);
        el_accept_btn.addEventListener('click', onClosePopup);
    };

    const onClosePopup = () => {
        el_gaming_popup.setVisibility(0);
        const el_top_bar = getElementById('topbar');
        el_top_bar.style.zIndex = 4;
        document.body.style.overflow = 'auto';
    };

    return { loginOnLoad, onClosePopup };
})();

module.exports = EuClosePopup;
