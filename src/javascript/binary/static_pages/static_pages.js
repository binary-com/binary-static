import GetStarted from './get_started';
import { handleHash } from '../base/utility';
import Scroll from '../common_functions/scroll';

module.exports = {
    OpenPositions: {
        onLoad: () => {
            Scroll.scrollToHashSection();
        },
    },
    VolidxMarkets: {
        onLoad: () => {
            Scroll.goToHashSection();
            GetStarted.onLoad();
        },
        onUnload: () => {
            Scroll.offScroll();
        },
    },
    OpenSourceProjects: {
        onLoad: () => {
            Scroll.sidebarScroll($('.open-source-projects'));
        },
        onUnload: () => {
            Scroll.offScroll();
        },
    },
    PaymentAgent: {
        onLoad: () => {
            Scroll.sidebarScroll($('.payment-agent'));
        },
        onUnload: () => {
            Scroll.offScroll();
        },
    },
    AffiliateSignup: {
        onLoad: () => {
            tabListener();
            handleHash();
        },
    },
};
