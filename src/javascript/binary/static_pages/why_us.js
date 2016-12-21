var Scroll = require('../common_functions/scroll').Scroll;
var Client = require('../base/client').Client;

var WhyUs = (function() {
    var init = function() {
        Scroll.sidebar_scroll($('.why-us'));
        hide_if_logged_in();
    };

    var hide_if_logged_in = function() {
        if (Client.get_boolean('is_logged_in')) {
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
