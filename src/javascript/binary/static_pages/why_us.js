const Scroll = require('../common_functions/scroll');
const Client = require('../base/client').Client;

const WhyUs = (function() {
    const onLoad = function() {
        Scroll.sidebar_scroll($('.why-us'));
        if (Client.is_logged_in()) {
            $('.client_logged_out').remove();
        }
    };

    const onUnload = function() {
        Scroll.offScroll();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = WhyUs;
