var MBProcess = (function() {
    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    function processActiveSymbols(data) {
        'use strict';

        // populate the Symbols object
        MBSymbols.details(data);

        var market       = 'major_pairs',
            symbols_list = MBSymbols.underlyings()[market],
            symbol       = MBDefaults.get('underlying'),
            update_page  = MBSymbols.need_page_update();

        if (update_page && (!symbol || !symbols_list[symbol])) {
            symbol = undefined;
        }
        displayUnderlyings('underlying', symbols_list, symbol);
        if (update_page) {
            MBProcess.processMarketUnderlying();
        }
    }

    /*
     * Function to call when underlying has changed
     */
    function processMarketUnderlying() {
        'use strict';

        var underlyingElement = document.getElementById('underlying');
        if (!underlyingElement) {
            return;
        }

        if(underlyingElement.selectedIndex < 0) {
            underlyingElement.selectedIndex = 0;
        }
        var underlying = underlyingElement.value;
        MBDefaults.set('underlying', underlying);

        showFormOverlay();

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks();
        // get ticks for current underlying
        MBTick.request(underlying);

        MBTick.clean();

        MBTick.updateWarmChart();

        BinarySocket.clearTimeouts();

        MBContract.getContracts(underlying);
    }

    /*
     * Function to process ticks stream
     */
    function processTick(tick) {
        'use strict';
        var symbol = $('#underlying').val();
        if(tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)){
            MBTick.details(tick);
            MBTick.display();
            MBTick.updateWarmChart();
        }
    }

    /*
     * Function to display contract form for current underlying
     */
    function processContract(contracts) {
        'use strict';

        window.chartAllowed = true;
        if (contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly') {
          window.chartAllowed = false;
        }

        MBContract.populateOptions(contracts);
    }

    return {
        processActiveSymbols: processActiveSymbols,
        processMarketUnderlying: processMarketUnderlying,
        processTick: processTick,
        processContract: processContract,
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
