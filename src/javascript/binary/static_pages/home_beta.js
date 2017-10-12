const Home        = require('./home');
const TabSelector = require('../common_functions/tab_selector');

const HomeBeta = (() => {
    const onLoad = () => {
        Home.onLoad();
        TabSelector.init(['market_tabs', 'account_tabs'], true);
    };

    const onUnLoad = () => {
        TabSelector.clean(['market_tabs', 'account_tabs'], true);
    };

    return {
        onLoad,
        onUnLoad,
    };
})();

module.exports = HomeBeta;
