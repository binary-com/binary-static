var Cookies = require('../../lib/js-cookie');
var Login = require('../base/login').Login;

function checkClientsCountry() {
    var clients_country = localStorage.getItem('clients_country');
    if (clients_country) {
        if (clients_country === 'jp') {
            limitLanguage('JA');
        } else if (clients_country === 'id') {
            limitLanguage('ID');
        } else {
            $('#language_select').show();
        }
    } else {
        BinarySocket.init();
        BinarySocket.send({ website_status: '1' });
    }
}

function limitLanguage(lang) {
    if (page.language() !== lang && !Login.is_login_pages()) {
        window.location.href = page.url_for_language(lang);
    }
    if (document.getElementById('language_select')) {
        $('#language_select').remove();
        $('#gmt-clock').removeClass();
        $('#gmt-clock').addClass('gr-6 gr-12-m');
        $('#contact-us').removeClass();
        $('#contact-us').addClass('gr-6 gr-hide-m');
    }
}

function japanese_client() {
    // handle for test case
    if (typeof window === 'undefined') return false;
    return (page.language().toLowerCase() === 'ja' || (Cookies.get('residence') === 'jp') || localStorage.getItem('clients_country') === 'jp');
}

module.exports = {
    checkClientsCountry: checkClientsCountry,
    japanese_client    : japanese_client,
};
