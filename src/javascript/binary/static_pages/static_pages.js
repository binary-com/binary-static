const GetStarted = require('./get_started');
const BinaryPjax = require('../base/binary_pjax');
const Client     = require('../base/client');
const handleHash = require('../base/utility').handleHash;
const Scroll     = require('../common_functions/scroll');

module.exports = {
    OpenPositions: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
    VolidxMarkets: {
        onLoad  : () => { Scroll.goToHashSection(); GetStarted.onLoad(); },
        onUnload: () => { Scroll.offScroll(); },
    },
    OpenSourceProjects: {
        onLoad  : () => { Scroll.sidebarScroll($('.open-source-projects')); },
        onUnload: () => { Scroll.offScroll(); },
    },
    PaymentAgent: {
        onLoad  : () => { Scroll.sidebarScroll($('.payment-agent')); },
        onUnload: () => { Scroll.offScroll(); },
    },
    AffiliateSignup: {
        onLoad: () => { tabListener(); handleHash(); },
    },
    LandingPage: {
        onLoad: () => { if (Client.hasAccountType('real')) BinaryPjax.loadPreviousUrl(); },
    },
};
