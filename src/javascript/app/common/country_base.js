const createLanguageDropDown = require('./attach_dom/language_dropdown');
const Client                 = require('../base/client');
const BinarySocket           = require('../base/socket');
const isLoginPages           = require('../../_common/base/login').isLoginPages;
const getElementById         = require('../../_common/common_functions').getElementById;
const Crowdin                = require('../../_common/crowdin');
const Language               = require('../../_common/language');
const State                  = require('../../_common/storage').State;

const checkClientsCountry = () => {
    if (Crowdin.isInContext() || isLoginPages()) return;
    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        const website_status = State.getResponse('website_status');
        if (!website_status) return;
        const clients_country = website_status.clients_country;
        if (clients_country === 'id') {
            limitLanguage('ID');
        } else {
            createLanguageDropDown(website_status);
        }
    });
};


// will return true for all clients with maltainvest/malta/iom financial/gaming landing company shortcode
// needs to wait for website_status, authorize, and landing_company before being called
// 'mt' is part of EU but account opening is not offered so the landing company response won't include the expected shortcode.
// we will use the fallback eu_excluded_regex for them.
const isEuCountry = () => {
    const eu_shortcode_regex  = new RegExp('^(maltainvest|malta|iom)$');
    const eu_excluded_regex   = new RegExp('^mt$');
    const financial_shortcode = State.getResponse('landing_company.financial_company.shortcode');
    const gaming_shortcode    = State.getResponse('landing_company.gaming_company.shortcode');
    const clients_country     = Client.get('residence') || State.getResponse('website_status.clients_country');
    return (
        (financial_shortcode || gaming_shortcode) ?
            (eu_shortcode_regex.test(financial_shortcode) || eu_shortcode_regex.test(gaming_shortcode)) :
            eu_excluded_regex.test(clients_country)
    );
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

const checkLanguage = () => {
    if (Language.get() === 'ID') {
        const $academy_link = $('.academy a');
        const academy_href  = $academy_link.attr('href');
        const regex         = /id/;
        if (!regex.test(academy_href)) {
            $academy_link.attr('href', academy_href + regex);
        }
    }
};

module.exports = {
    checkClientsCountry,
    isEuCountry,
    checkLanguage,
};
