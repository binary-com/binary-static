const MenuSelector   = require('../../_common/menu_selector');
const TabSelector    = require('../../_common/tab_selector');
const isEuCountry    = require('../../app/common/country_base').isEuCountry;
const BinarySocket   = require('../../app/base/socket');

module.exports = {
    BinaryOptions: {
        onLoad  : () => { MenuSelector.init(['what-are-binary-options', 'how-to-trade-binary', 'types-of-trades', 'range-of-markets', 'glossary']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    CFDs: {
        onLoad  : () => { MenuSelector.init(['what-cfds-trading', 'how-trade-cfds', 'margin-policy', 'contract-specification']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    Cryptocurrencies: {
        onLoad  : () => { MenuSelector.init(['what-crypto-trading', 'how-trade-crypto', 'margin-policy', 'contract-specification']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    Metals: {
        onLoad  : () => { MenuSelector.init(['what-metals-trading', 'how-trade-metals', 'margin-policy', 'contract-specification']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    Forex: {
        onLoad  : () => { MenuSelector.init(['what-forex-trading', 'how-to-trade-forex', 'margin-policy', 'contract-specification']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    Index: {
        onLoad: () => {
            BinarySocket.wait('website_status', 'landing_company').then(() => {
                if (isEuCountry()) {
                    const redirect_url = `${location.protocol}//${location.host}${location.pathname}?get_started_tabs=mt5`;
                    window.history.pushState({ path: redirect_url },'',redirect_url);
                }
                TabSelector.onLoad();
            });
        },
        onUnload: () => {
            TabSelector.onUnload();
        },
    },
};
