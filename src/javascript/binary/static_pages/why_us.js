const Scroll = require('../common_functions/scroll').Scroll;
const Client = require('../base/client').Client;

const WhyUs = (function() {
    const init = function() {
        Scroll.sidebar_scroll($('.why-us'));
        hide_if_logged_in();
    };

    const hide_if_logged_in = function() {
        if (Client.is_logged_in()) {
            $('.client_logged_out').remove();
        }
    };

    return {
        init: init,
    };
})();

module.exports = {
    WhyUs: WhyUs,
};
