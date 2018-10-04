const getElementById = require('../../_common/common_functions').getElementById;
const TabSelector    = require('../../_common/tab_selector');

const Platforms = (() => {
    const onLoad = () => {
        TabSelector.onLoad();
        $.getJSON('https://api.github.com/repos/binary-com/binary-desktop-installers/releases/latest', (data = { assets: [] }) => {
            let link_mac,
                link_windows;
            // link_linux;
            data.assets.some((asset) => {
                // if (link_mac && link_windows && link_linux) {
                if (link_mac && link_windows) {
                    return true;
                }
                if (/\.dmg$/.test(asset.browser_download_url)) {
                    link_mac = asset.browser_download_url;
                } else if (/\.exe$/.test(asset.browser_download_url)) {
                    link_windows = asset.browser_download_url;
                    // } else if (/x86_64\.AppImage$/.test(asset.browser_download_url)) {
                    //     link_linux = asset.browser_download_url;
                }
                return false;
            });
            getElementById('app_mac').setAttribute('href', link_mac);
            getElementById('app_windows').setAttribute('href', link_windows);
            // getElementById('app_linux').setAttribute('href', link_linux);
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Platforms;
