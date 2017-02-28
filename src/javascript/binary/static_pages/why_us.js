const Scroll = require('../common_functions/scroll').Scroll;
const Client = require('../base/client').Client;

const WhyUs = (function() {
    const init = function() {
        Scroll.sidebar_scroll($('.why-us'));
        Client.activate_by_client_type('body');
    };

    return {
        init: init,
    };
})();

module.exports = {
    WhyUs: WhyUs,
};
