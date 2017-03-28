const Client = require('../base/client');
const Scroll = require('../common_functions/scroll');

const WhyUs = (() => {
    'use strict';

    const onLoad = () => {
        Scroll.sidebarScroll($('.why-us'));
        Client.activateByClientType();
    };

    const onUnload = () => {
        Scroll.offScroll();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = WhyUs;
