const createLanguageDropDown = require('./attach_dom/language_dropdown');
const BinarySocket           = require('../base/socket');
const getElementById         = require('../../_common/common_functions').getElementById;
const Crowdin                = require('../../_common/crowdin');
const Language               = require('../../_common/language');
const LocalStore             = require('../../_common/storage').LocalStore;
const applyToAllElements     = require('../../_common/utility').applyToAllElements;

const checkClientsCountry = () => {
    if (Crowdin.isInContext()) return;
    BinarySocket.wait('website_status').then((response) => {
        if (response.error) return;
        const website_status  = response.website_status;
        const clients_country = website_status.clients_country;
        if (clients_country === 'jp') {
            limitLanguage('JA');
        } else if (clients_country === 'id') {
            limitLanguage('ID');
        } else {
            createLanguageDropDown(website_status);
        }
    });
};

const limitLanguage = (lang) => {
    if (Language.get() !== lang) {
        window.location.href = Language.urlFor(lang); // need to redirect not using pjax
    }
    if (getElementById('select_language')) {
        $('.languages').remove();
        $('#gmt-clock').addClass('gr-6 gr-11-m').removeClass('gr-5 gr-6-m');
        $('#contact-us').addClass('gr-5').removeClass('gr-2');
    }
};

const jpClient = () => (Language.get() === 'JA' || jpResidence());

const jpResidence = () => (LocalStore.getObject('client.accounts')[LocalStore.get('active_loginid')] || {}).residence === 'jp';

const checkLanguage = () => {
    if (Language.get() === 'ID') {
        const $academy_link = $('.academy a');
        const academy_href  = $academy_link.attr('href');
        const regex         = /id/;
        if (!regex.test(academy_href)) {
            $academy_link.attr('href', academy_href + regex);
        }
    }
    if (jpClient()) {
        $('.ja-hide').setVisibility(0);
        applyToAllElements('.ja-show', (el) => {
            if (!/client_logged_(in|out)/.test(el.classList)) {
                el.setVisibility(1);
            }
        });
        if (!jpResidence()) {
            $('#topMenuCashier').hide();
        }
    }
};

module.exports = {
    checkClientsCountry,
    jpClient,
    jpResidence,
    checkLanguage,
};
