const Scroll = require('../common_functions/scroll');

module.exports = {
    OpenPositions: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
    VolidxMarkets: {
        onLoad  : () => { Scroll.goToHashSection(); },
        onUnload: () => { Scroll.offScroll(); },
    },
    OpenSourceProjects: {
        onLoad  : () => { Scroll.sidebar_scroll($('.open-source-projects')); },
        onUnload: () => { Scroll.offScroll(); },
    },
    PaymentAgent: {
        onLoad  : () => { Scroll.sidebar_scroll($('.payment-agent')); },
        onUnload: () => { Scroll.offScroll(); },
    },
};
