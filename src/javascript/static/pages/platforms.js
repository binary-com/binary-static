const getElementById = require('../../_common/common_functions').getElementById;
const TabSelector    = require('../../_common/tab_selector');
const GTM            = require('../../_common/base/gtm');

const os_list = [
    {
        name    : 'mac',
        url_test: /\.dmg$/,
    },
    {
        name    : 'windows',
        url_test: /\.exe$/,
    },
    // {
    //     name    : 'linux',
    //     url_test: /x86_64\.AppImage$/,
    // }
];

const Platforms = (() => {
    const onLoad = () => {
        TabSelector.onLoad();
        $.getJSON('https://api.github.com/repos/binary-com/binary-desktop-installers/releases/latest', (data = { assets: [] }) => {
            data.assets.some((asset) => {
                if (os_list.every(os => os.download_url)) {
                    return true;
                }
                os_list.forEach(os => {
                    if (os.download_url) return;
                    if (os.url_test.test(asset.browser_download_url)) {
                        os.download_url = asset.browser_download_url;
                    }
                });
                return false;
            });
            os_list.forEach(os => {
                const el_button = getElementById(`app_${os.name}`);
                el_button.setAttribute('href', os.download_url);
                el_button.addEventListener('click', () => {
                    GTM.pushDataLayer({ event: `${os.name}_app_download`, test: 'testasd' });
                });
            });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Platforms;
