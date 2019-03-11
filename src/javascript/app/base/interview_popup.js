const Cookies        = require('js-cookie');
const BinarySocket   = require('./socket');
const isEuCountry    = require('../common/country_base').isEuCountry;
const Client         = require('../base/client');

const InterviewPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
            if (Client.isLoggedIn() && isEuCountry() && !Cookies.get('InterviewConsent')) {
                const interview_popup = $('#interview_popup_container');
                const interview_no_thanks = $('#interview_no_thanks');
                const interview_ask_later = $('#interview_ask_later');
                const interview_interested = $('#interview_interested');

                interview_popup.removeClass('invisible');
                interview_no_thanks.on('click', () => {
                    Cookies.set('InterviewConsent', 1);
                    interview_popup.addClass('invisible');
                });
                interview_ask_later.on('click', () => {
                    interview_popup.addClass('invisible');
                });
                interview_interested.on('click', () => {
                    interview_popup.addClass('invisible');
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
