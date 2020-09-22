const BinarySocket = require('./socket');
const Client = require('../base/client');
const Login = require('../../_common/base/login');
const getElementById = require('../../_common/common_functions').getElementById;
const isEuCountry = require('../common/country_base').isEuCountry;

const RedirectPopup = (() => {
    const learn_more_url = 'https://deriv.com/interim/faq/';
    let el_popup_container,
        el_checkbox,
        el_link_login,
        el_link_more,
        el_close;

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const should_show_popup = !localStorage.getItem('is_redirect_popup_dismissed');
            el_popup_container = getElementById('redirect_popup_container');
            el_checkbox = getElementById('redirect_popup_checkbox');
            el_link_login = getElementById('redirect_popup_login');
            el_link_more = getElementById('redirect_popup_more');
            el_close = getElementById('redirect_popup_close');

            if (!Client.isLoggedIn() && isEuCountry() && should_show_popup) {
                
                el_popup_container.classList.remove('invisible');
                el_checkbox.addEventListener('change', toggleDismissed);
                el_close.addEventListener('click', hidePopup);
                el_link_login.addEventListener('click', redirectToLogin);
                el_link_more.addEventListener('click', redirectToDetails);
            }
        });

    };

    const toggleDismissed = () => {
        const is_checked = el_checkbox.checked;
        
        if (is_checked) {
            localStorage.setItem('is_redirect_popup_dismissed', 1);
        } else {
            localStorage.removeItem('is_redirect_popup_dismissed');
        }
    };

    const hidePopup = () => {
        el_popup_container.classList.add('invisible');
        onUnload();
    };

    const redirectToLogin = () => {
        const url = Login.getLoginUrl('deriv.com');
        hidePopup();
        window.open(url);
    };

    const redirectToDetails = () => {
        hidePopup();
        window.open(learn_more_url);
    };

    const onUnload = ()=>{
        el_checkbox.removeEventListener('change', toggleDismissed);
        el_close.removeEventListener('click', hidePopup);
        el_link_login.removeEventListener('click', redirectToLogin);
        el_link_more.removeEventListener('click', redirectToDetails);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = RedirectPopup;
