import Client from '../base/client';
import Scroll from '../common_functions/scroll';

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
