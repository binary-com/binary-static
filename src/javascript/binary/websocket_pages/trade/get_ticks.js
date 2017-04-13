const TradingAnalysis = require('./analysis');
const Barriers        = require('./barriers');
const updateWarmChart = require('./common').updateWarmChart;
const DigitInfo       = require('./charts/digit_info');
const Defaults        = require('./defaults');
const Purchase        = require('./purchase');
const Tick            = require('./tick');
const TickDisplay     = require('./tick_trade');

const GetTicks = (() => {
    const request = (symbol) => {
        BinarySocket.send({
            ticks_history: symbol,
            style        : 'ticks',
            end          : 'latest',
            count        : 20,
            subscribe    : 1,
        }, {
            callback: (response) => {
                const type = response.msg_type;
                if (type === 'tick') {
                    processTick(response);
                    if (TradingAnalysis.getActiveTab() === 'tab_last_digit') {
                        DigitInfo.updateChart(response);
                    }
                } else if (type === 'history') {
                    processHistory(response);
                    if (TradingAnalysis.getActiveTab() === 'tab_last_digit') {
                        DigitInfo.showChart(response.echo_req.ticks_history, response.history.prices);
                    }
                }
            },
        });
    };

    const processTick = (tick) => {
        const symbol = Defaults.get('underlying');
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
            Tick.details(tick);
            Tick.display();
            TickDisplay.updateChart(tick);
            Purchase.updateSpotList();
            if (!Barriers.isBarrierUpdated()) {
                Barriers.display();
                Barriers.setBarrierUpdate(true);
            }
            updateWarmChart();
        }
    };

    const processHistory = (res) => {
        if (res.history && res.history.times && res.history.prices) {
            for (let i = 0; i < res.history.times.length; i++) {
                Tick.details({
                    tick: {
                        epoch: res.history.times[i],
                        quote: res.history.prices[i],
                    },
                });
            }
        }
    };

    return {
        request       : request,
        processTick   : processTick,
        processHistory: processHistory,
    };
})();

module.exports = GetTicks;
