const isEuCountry    = require('../../app/common/country_base').isEuCountry;
const getElementById = require('../../_common/common_functions').getElementById;
const MenuSelector   = require('../../_common/menu_selector');

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
    BinaryOptionsForMT5: {
        onLoad: () => {
            let menu_sections = [
                'what-are-binary-options',
                'how-to-trade-binary',
                'types-of-trades',
            ];
            if (isEuCountry()) {
                getElementById('how-to-trade-binary').setVisibility(0);
                menu_sections = menu_sections.filter(menu_item => menu_item !== 'how-to-trade-binary');
            }
            MenuSelector.init(menu_sections);
        },
        onUnload: () => { MenuSelector.clean(); },
    },
};
