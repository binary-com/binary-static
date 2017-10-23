const Crowdin                = require('../base/crowdin');
const Language               = require('../base/language');
const LocalStore             = require('../base/storage').LocalStore;
const createLanguageDropDown = require('../common_functions/attach_dom/language_dropdown');
const BinarySocket           = require('../websocket_pages/socket');

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
    if (document.getElementById('select_language')) {
        $('.languages').remove();
        $('#gmt-clock').addClass('gr-6 gr-12-m').removeClass('gr-5 gr-6-m');
        $('#contact-us').addClass('gr-6').removeClass('gr-2');
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
        $('.ja-show').setVisibility(1);
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
