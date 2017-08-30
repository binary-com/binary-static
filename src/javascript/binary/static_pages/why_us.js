const Client = require('../base/client');
const Scroll = require('../common_functions/scroll');

const WhyUs = (() => {
    const onLoad = () => {
        Scroll.sidebarScroll($('.why-us'));
        Client.activateByClientType();
    };

    const onUnload = () => {
        Scroll.offScroll();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = WhyUs;
