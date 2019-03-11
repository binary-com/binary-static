const Cookies      = require('js-cookie');
const BinarySocket = require('./socket');
const Client       = require('../base/client');
const isEuCountry  = require('../common/country_base').isEuCountry;

const InterviewPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
            const is_interview_consent = Cookies.get('InterviewConsent');

            if (Client.isLoggedIn() && isEuCountry() && !is_interview_consent) {
                const $interview_popup      = $('#interview_popup_container');
                const $interview_no_thanks  = $('#interview_no_thanks');
                const $interview_ask_later  = $('#interview_ask_later');
                const $interview_interested = $('#interview_interested');

                $interview_popup.removeClass('invisible');
                $interview_no_thanks.one('click', () => {
                    Cookies.set('InterviewConsent', 1);
                    $interview_popup.addClass('invisible');
                });
                $interview_ask_later.one('click', () => {
                    $interview_popup.addClass('invisible');
                });
                $interview_interested.one('click', () => {
                    $interview_popup.addClass('invisible');
                    Cookies.set('InterviewConsent', 1);
                    window.open('https://goo.gl/forms/XJFZlYsvo3K4FcQ02', '_blank');
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = InterviewPopup;
