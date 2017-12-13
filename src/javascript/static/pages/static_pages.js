const tabListener = require('binary-style').tabListener;
const GetStarted  = require('./get_started');
const Scroll      = require('../../_common/scroll');
const handleHash  = require('../../_common/utility').handleHash;
const BinaryPjax  = require('../../app/base/binary_pjax');
const Client      = require('../../app/base/client');
const Header      = require('../../app/base/header');

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
    handleTab: {
        onLoad: () => { tabListener(); handleHash(); },
    },
    TypesOfAccounts: {
        onLoad: () => { Scroll.goToHashSection(); return false; },
    },
    LandingPage: {
        onLoad: () => {
            if (Client.hasAccountType('real')) {
                BinaryPjax.loadPreviousUrl();
            } else {
                Header.upgradeMessageVisibility();
            }
        },
    },
};
