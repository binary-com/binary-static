const Cookies          = require('js-cookie');
const BinarySocket     = require('./socket');
const Client           = require('../base/client');
const isEuCountry      = require('../common/country_base').isEuCountry;
const RealityCheckData = require('../pages/user/reality_check/reality_check.data');

const RedirectPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
            const has_dont_show       = Cookies.get('RedirectPopup');
            const $redirect_popup     = $('#redirect_popup_container');
            const $redirect_checkbox  = $('#redirect_popup_checkbox');
            const $redirect_login  = $('#redirect_popup_login');
            const $redirect_more = $('#redirect_popup_more');

            if (Client.isLoggedIn() && isEuCountry() && !has_dont_show) {
                setTimeout(() => {
                    $redirect_popup.removeClass('invisible');
                }, 2000);
                $redirect_checkbox.change( function () {
                    const is_checked = $(this).is(':checked');
                    const expires = 3650; // 10 years

                    if (is_checked) {
                        Cookies.set('RedirectPopup', true, { expires });
                    } else {
                        Cookies.remove('RedirectPopup');
                    }
                    
                });
                $redirect_login.click(() => {
                    $redirect_popup.addClass('invisible');
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = RedirectPopup;
