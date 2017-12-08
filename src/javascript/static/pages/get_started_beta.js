const MenuSelector = require('../../_common/menu_selector');
const TabSelector  = require('../../_common/tab_selector');

module.exports = {
    GetStartedBeta: {
        onLoad  : () => { TabSelector.init('get_started_tabs', false, ['binary-options', 'mt5']); },
        onUnload: () => { TabSelector.clean(); },
    },
    BinaryOptions: {
        onLoad  : () => { MenuSelector.init(['what-are-binary-options', 'range-of-markets', 'types-of-trades', 'how-to-trade-binary', 'glossary']); },
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
};
