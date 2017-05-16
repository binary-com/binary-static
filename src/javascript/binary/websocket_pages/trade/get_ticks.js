const Barriers             = require('./barriers');
const Barriers_Beta        = require('./beta/barriers');
const DigitInfo_Beta       = require('./beta/charts/digit_info');
const Purchase_Beta        = require('./beta/purchase');
const TickDisplay_Beta     = require('./beta/tick_trade');
const updateWarmChart      = require('./common').updateWarmChart;
const DigitInfo            = require('./charts/digit_info');
const Defaults             = require('./defaults');
const getActiveTab         = require('./get_active_tab').getActiveTab;
const getActiveTab_Beta    = require('./get_active_tab').getActiveTab_Beta;
const Purchase             = require('./purchase');
const Tick                 = require('./tick');
const TickDisplay          = require('./tick_trade');
const MBDefaults           = require('../mb_trade/mb_defaults');
const MBTick               = require('../mb_trade/mb_tick');
const BinarySocket         = require('../socket');
const State                = require('../../base/storage').State;

const GetTicks = (() => {
    let underlying;

    const request = (symbol, req, callback) => {
        underlying = State.get('is_mb_trading') ? MBDefaults.get('underlying') : Defaults.get('underlying');
        if (underlying && req && callback && (underlying !== req.ticks_history || !req.subscribe)) {
            BinarySocket.send(req, { callback: callback });
        } else {
            if (!req || req.subscribe) {
                BinarySocket.send({ forget_all: 'ticks' });
                BinarySocket.send({ forget_all: 'candles' });
            }
            BinarySocket.send(req || {
                ticks_history: symbol || underlying,
                style        : 'ticks',
                end          : 'latest',
                count        : 20,
                subscribe    : 1,
            }, {
                callback: (response) => {
                    const type = response.msg_type;
                    const is_digit = getActiveTab() === 'tab_last_digit';
                    const is_digit_beta = getActiveTab_Beta() === 'tab_last_digit';
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                    if (State.get('is_mb_trading')) {
                        MBTick.processTickHistory(response);
                        return;
                    }
                    if (type === 'tick') {
                        if (State.get('is_trading')) {
                            processTick(response);
                            if (is_digit) {
                                DigitInfo.updateChart(response);
                            }
                        } else if (State.get('is_beta_trading')) {
                            processTick_Beta(response);
                            if (is_digit_beta) {
                                DigitInfo_Beta.updateChart(response);
                            }
                        }
                    } else if (type === 'history') {
                        processHistory(response);
                        if (is_digit) {
                            DigitInfo.showChart(response.echo_req.ticks_history, response.history.prices);
                        } else if (is_digit_beta) {
                            DigitInfo_Beta.showChart(response.echo_req.ticks_history, response.history.prices);
                        }
                    }
                },
            });
        }
    };

    const processTick = (tick) => {
        const symbol = underlying;
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

    const processTick_Beta = (tick) => {
        const symbol = underlying;
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
            Tick.details(tick);
            Tick.display();
            TickDisplay_Beta.updateChart(tick);
            Purchase_Beta.updateSpotList();
            if (!Barriers_Beta.isBarrierUpdated()) {
                Barriers_Beta.display();
                Barriers_Beta.setBarrierUpdate(true);
            }
            updateWarmChart();
        } else {
            DigitInfo_Beta.updateChart(tick);
        }
    };

    return {
        request: request,
    };
})();

module.exports = GetTicks;
