const tabListener    = require('@binary-com/binary-style').tabListener;
const getElementById = require('../../_common/common_functions').getElementById;
const ImageSlider    = require('../../_common/image_slider');
const MenuSelector   = require('../../_common/menu_selector');
const Scroll         = require('../../_common/scroll');
const TabSelector    = require('../../_common/tab_selector');
const handleHash     = require('../../_common/utility').handleHash;
const BinaryPjax     = require('../../app/base/binary_pjax');
const Client         = require('../../app/base/client');
const Header         = require('../../app/base/header');
const hideEU         = require('../../app/common/common_functions').hideEU;

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
    AffiliatesFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management-and-tracking', 'marketing-and-promotions', 'support']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    IBProgrammeFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management', 'marketing-and-promotions']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    Cloudflare: {
        onLoad: () => {},
    },
    Tour: {
        onLoad: () => { hideEU(); },
    },
    Platforms: {
        onLoad: () => {
            TabSelector.onLoad();
            $.getJSON('https://api.github.com/repos/binary-com/binary-desktop-installers/releases/latest', (data = { assets: [] }) => {
                let link_mac,
                    link_windows,
                    link_linux;
                data.assets.some((asset) => {
                    if (link_mac && link_windows && link_linux) {
                        return true;
                    }
                    if (/\.dmg$/.test(asset.browser_download_url)) {
                        link_mac = asset.browser_download_url;
                    } else if (/\.exe$/.test(asset.browser_download_url)) {
                        link_windows = asset.browser_download_url;
                    } else if (/x86_64\.AppImage$/.test(asset.browser_download_url)) {
                        link_linux = asset.browser_download_url;
                    }
                    return false;
                });
                getElementById('app_mac').setAttribute('href', link_mac);
                getElementById('app_windows').setAttribute('href', link_windows);
                getElementById('app_linux').setAttribute('href', link_linux);
            });
        },
    },
};
