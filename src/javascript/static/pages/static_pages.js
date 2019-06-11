const tabListener  = require('@binary-com/binary-style').tabListener;
const ImageSlider  = require('../../_common/image_slider');
const MenuSelector = require('../../_common/menu_selector');
const TabSelector  = require('../../_common/tab_selector');
const Scroll       = require('../../_common/scroll');
const handleHash   = require('../../_common/utility').handleHash;
const BinaryPjax   = require('../../app/base/binary_pjax');
const Client       = require('../../app/base/client');
const Header       = require('../../app/base/header');
const Url          = require('../../../javascript/_common/url.js');

module.exports = {
    OpenPositions: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
    Careers: {
        onLoad: () => { tabListener(); handleHash(); $('.has-tabs').tabs(); },
    },
    Locations: {
        onLoad  : () => { ImageSlider.init(); },
        onUnload: () => { ImageSlider.onUnMount(); },
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
    LandingPage: {
        onLoad: () => {
            if (Client.hasAccountType('real')) {
                BinaryPjax.loadPreviousUrl();
            } else {
                Header.upgradeMessageVisibility();
            }
        },
    },
    AffiliatesIb: {
        onLoad: () => {
            $('.has-tabs').tabs();

            const navigation_tabs = $('.has-tabs').children('ul').find('li');

            // If query string not set, set it.
            const params_hash = Url.paramsHash();
            if (params_hash.tabs === undefined) {
                Url.updateParamsWithoutReload({ tabs: navigation_tabs.first().find('a').attr('href').replace('#', '') }, true);
            }
            // If query string set, then open the correct tab.
            navigation_tabs.each((index, element) => {
                $(element).on('click', () => Url.updateParamsWithoutReload({ tabs: $(element).find('a').attr('href').replace('#', '') }, true));
            });

            navigation_tabs.each((index, element) => {
                const id = $(element).find('a').attr('href').replace('#', '');
                $('.has-tabs').tabs({ active: params_hash.tabs === id ? index : 0 });
            });

            TabSelector.onLoad();
        },
        onUnload: () => { TabSelector.onUnload(); },
    },
    AffiliatesFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management-and-tracking', 'referral-tools', 'support']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    IBProgrammeFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management', 'referral-tools']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    BinaryInNumbers: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
};
