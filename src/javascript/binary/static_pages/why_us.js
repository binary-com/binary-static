const Scroll = require('../common_functions/scroll');
const Client = require('../base/client').Client;

const WhyUs = (function() {
    const onLoad = function() {
        Scroll.sidebar_scroll($('.why-us'));
        Client.activate_by_client_type();
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
