const State  = require('../../binary/base/storage').State;
const Client = require('../../binary/base/client').Client;
const PortfolioWS = require('../../binary/websocket_pages/user/account/portfolio/portfolio.init');

const JapanPortfolio = (function() {
    let $portfolio,
        isPortfolioActive = false;

    function init() {
        if (isActive()) {
            $('#tab_portfolio').removeClass('invisible');
        }

        const $container = $('#tab_portfolio-content');
        $portfolio = $portfolio || $('#portfolio');

        if ($portfolio &&
        (!$portfolio.parent().length ||
        $portfolio.parent().get(0).id !== 'tab_portfolio-content')) {
            $portfolio.detach();
            $container.append($portfolio);
        }
    }

    function show() {
        if (isTradePage() && !isPortfolioActive) {
            PortfolioWS.onLoad();
            isPortfolioActive = true;
        }
    }

    function isActive() {
        return !!(Client.is_logged_in() && isTradePage());
    }

    function hide() {
        if (isTradePage() && isPortfolioActive) {
            PortfolioWS.onUnload();
            isPortfolioActive = false;
            $portfolio = undefined;
        }
    }

    function isTradePage() {
        return State.get('is_mb_trading');
    }

    return {
        init    : init,
        show    : show,
        hide    : hide,
        isActive: isActive,
    };
})();

module.exports = {
    JapanPortfolio: JapanPortfolio,
};
