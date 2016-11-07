var Scroll = require('../common_functions/scroll').Scroll;

var WhyUs = (function() {
    var init = function() {
        Scroll.sidebar_scroll($('.why-us'));
        hide_if_logged_in();
    };

    var hide_if_logged_in = function() {
        if (page.client.is_logged_in) {
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
