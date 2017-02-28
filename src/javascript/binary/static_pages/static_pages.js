const Scroll     = require('../common_functions/scroll');
const handleHash = require('../base/utility').handleHash;
const GetStarted = require('./get_started');

module.exports = {
    OpenPositions: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
    VolidxMarkets: {
        onLoad  : () => { Scroll.goToHashSection(); GetStarted.onLoad(); },
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
    AffiliateSignup: {
        onLoad: () => { tabListener(); handleHash(); },
    },
};
