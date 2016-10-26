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
        var symbol = MBDefaults.get('underlying');
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
        processPriceRequest();
    }

    function processForgetProposals() {
        'use strict';
        //showPriceOverlay();
        BinarySocket.send({
            forget_all: "proposal"
        });
        //Price.clearMapping();
    }

    function processPriceRequest() {
        'use strict';
        //Price.incrFormId();
        MBPrice.increaseReqId();
        processForgetProposals();
        //showPriceOverlay();
        var available_contracts = MBContract.getCurrentContracts(),
            durations = MBDefaults.get('period').split('_');
        var req = {
            proposal   : 1,
            subscribe  : 1,
            basis      : 'payout',
            amount     : (parseInt(MBDefaults.get('payout')) || 1) * 1000,
            currency   : (TUser.get().currency || 'JPY'),
            symbol     : MBDefaults.get('underlying'),
            date_expiry: durations[1],
            req_id     : MBPrice.getReqId(),
            trading_period_start: durations[0],
        };
        var barriers_array, i, j, barrier_count;
        for (i = 0; i < available_contracts.length; i++) {
            req.contract_type = available_contracts[i].contract_type;
            barrier_count = available_contracts[i].barriers == 2 ? 2 : 1;
            barriers_array = available_contracts[i].available_barriers;
            for (j = 0; j < barriers_array.length; j++) {
                if (available_contracts[i].barriers == 2) {
                    req.barrier = barriers_array[j][0];
                    req.barrier2 = barriers_array[j][1];
                    if (available_contracts[i].expired_barriers.indexOf(req.barrier2) > -1) {
                        continue;
                    }
                } else {
                    req.barrier = barriers_array[j];
                }
                if (available_contracts[i].expired_barriers.indexOf(req.barrier) < 0) {
                    BinarySocket.send(req);
                }
            }
        }
    }

    function processProposal(response) {
        'use strict';
        var req_id = MBPrice.getReqId();
        if(response.echo_req && response.echo_req !== null && response.echo_req.passthrough && response.echo_req.req_id === req_id){
            // hideOverlayContainer();
            MBPrice.display(response);
            // hidePriceOverlay();
        }
    }

    return {
        processActiveSymbols: processActiveSymbols,
        processMarketUnderlying: processMarketUnderlying,
        processTick: processTick,
        processContract: processContract,
        processPriceRequest: processPriceRequest,
        processProposal: processProposal,
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
