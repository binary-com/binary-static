import { WS }                from 'Services';
import {
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerSpotMiddle,
    createMarkerEndTime,
    createMarkerPurchaseTime,
    createMarkerStartTime,
} from './chart-marker-helpers';

export const createChartTickMarkers = (SmartChartStore, contract_info) => {
    const tick_marker_handler = tickMarker.getInstance(SmartChartStore, contract_info);

    if (contract_info.exit_tick_time) {
        tick_marker_handler.addSpotsFromHistory();
        tick_marker_handler.addLines();
    } else {
        // TODO: implement middle tick markers for ongoing contracts
        // tick_marker_handler.addOnGoingMarkers();
    }
};

const zip = (arr, ...arrs) => arr.map((val, idx) => arrs.reduce((a, curr) => [...a, curr[idx]], [val]));

const makeTickArr = (price_arr, times_arr) =>
    zip(price_arr, times_arr).reduce((acc, tick) => [...acc, { price: tick[0], time: tick[1] }], []);

const multiple = (parentFn) => ([...fncs]) => fncs.forEach(parentFn);

const tickMarker = (function () {
    let instance;

    const tickMarkerHandler = (SmartChartStore, { ...contract_info }) => {
        const ticks_history_req = {
            ticks_history: contract_info.underlying,
            start        : contract_info.entry_tick_time,
            end          : contract_info.exit_tick_time,
            count        : (contract_info.tick_count + 1), // add 1 to prevent for 1-tick contracts from returning 5000 ticks
        };

        const addMarkerFromContract = (createMarkerFn) => {
            const marker_config = createMarkerFn(contract_info);
            if (marker_config) SmartChartStore.createMarker(marker_config);
        };

        const addMarkerFromTick = (createMarkerFn, tick, idx) => {
            const marker_config = createMarkerFn(tick, idx);
            if (marker_config) SmartChartStore.createMarker(marker_config);
        };

        const isContractTick = tick =>
            +tick.time >= +contract_info.entry_tick_time && +tick.time <= +contract_info.exit_tick_time;

        const isMiddleTick = tick =>
            +tick.time > contract_info.entry_tick_time && tick.time < contract_info.exit_tick_time;

        const isEntryTick = tick => +tick.time === +contract_info.entry_tick_time;

        const isExitTick = tick => +tick.time === +contract_info.exit_tick_time;

        const addTickToChart = (tick, idx) => {
            const is_entry  = idx === 0 && isEntryTick(tick);
            const is_exit   = isExitTick(tick);
            const is_middle = isMiddleTick(tick);

            if (is_entry) addMarkerFromContract(createMarkerSpotEntry);
            if (is_exit) addMarkerFromContract(createMarkerSpotExit);
            if (is_middle) addMarkerFromTick(createMarkerSpotMiddle, tick, idx);
        };

        const addTicks = ([ ...ticks_arr ]) => {
            const contract_ticks = ticks_arr
                .sort((a, b) => +a.time - +b.time)
                .filter(isContractTick);

            contract_ticks.forEach(addTickToChart);
        };

        const onTicksHistory = (data) => {
            const { prices, times } = data.history;
            const ticks = makeTickArr(prices, times);

            addTicks(ticks);
        };

        return {
            addSpotsFromHistory: () =>
                WS.sendRequest({ ...ticks_history_req }).then(onTicksHistory),
            addLines: () => {
                multiple(addMarkerFromContract)([createMarkerEndTime, createMarkerPurchaseTime, createMarkerStartTime]);
            },
            getContractId: () => contract_info.contract_id,
        };
    };

    return {
        getInstance: (SmartChartStore, contract_info) => {
            if (!instance || instance.getContractId() !== contract_info.contract_id) {
                instance = tickMarkerHandler(SmartChartStore, contract_info);
            }
            return instance;
        },
    };
})();
