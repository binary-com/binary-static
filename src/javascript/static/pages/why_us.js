const Client = require('../../app/base/client');
const Scroll = require('../../_common/scroll');

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
