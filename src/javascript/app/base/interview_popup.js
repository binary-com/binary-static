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

                interview_popup.removeClass('invisible');
                interview_no_thanks.addEventListener('click', () => {
                    interview_popup.addClass('invisible');
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = InterviewPopup;
