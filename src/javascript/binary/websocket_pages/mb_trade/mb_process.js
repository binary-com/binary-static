var MBProcess = (function() {
    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    function activeSymbols(data) {
        'use strict';

        // populate the Symbols object
        Symbols.details(data);

        var market = getDefaultMarket();

        // store the market
        Defaults.set('market', market);

        displayMarkets('contract_markets', Symbols.markets(), market);
        processMarket();
        // setTimeout(function(){
        // if(document.getElementById('underlying')){
        //     Symbols.getSymbols(0);
        // }
        // }, 60*1000);
    }

    return {
        activeSymbols: activeSymbols,
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
