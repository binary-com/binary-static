const BinarySocket     = require('./socket');
const isEuCountry      = require('../common/country_base').isEuCountry;
const Client           = require('../base/client');
const Login            = require('../../_common/base/login');

const RedirectPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const has_dont_show = localStorage.getItem('redirect_popup');
            const $popup        = $('#redirect_popup_container');
            const $checkbox     = $('#redirect_popup_checkbox');
            const $login        = $('#redirect_popup_login');
            const $more         = $('#redirect_popup_more');
            const $close        = $('#redirect_popup_close');

            if (!Client.isLoggedIn() && isEuCountry() && !has_dont_show) {
                setTimeout(() => {
                    $popup.removeClass('invisible');
                }, 2000);

                $checkbox.on('change', function () {
                    const is_checked = $(this).is(':checked');
                    
                    if (is_checked) {
                        localStorage.setItem('redirect_popup', 1);
                    } else {
                        localStorage.removeItem('redirect_popup');
                    }
                });

                $close.on('click', () => {
                    $popup.addClass('invisible');
                });
                
                $login.one('click', () => {
                    const url = Login.loginUrl('deriv.com');
                    $popup.addClass('invisible');
                    location.href = url;
                });

                $more.one('click', () => {
                    const url = 'http://deriv.com/interim/faq/';
                    $popup.addClass('invisible');
                    location.href = url;
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = RedirectPopup;
