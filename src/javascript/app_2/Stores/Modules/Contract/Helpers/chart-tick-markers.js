import { WS }                  from 'Services';
import {
    createMarkerConfig,
    createMarkerSpotEntry,
    createMarkerSpotExit }     from './chart-marker-helpers';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

let has_been_initialized = false;

export const createChartTickMarkers = (SmartChartStore, contract_info) => {
    if (!has_been_initialized) {
        const middle_ticks_handler = middleTicksHandler(SmartChartStore, contract_info);
        has_been_initialized = true;

        if (contract_info.exit_tick_time) {
            middle_ticks_handler.addMarkersFromHistory(contract_info);
        } else {
            // TODO: implement middle tick markers for ongoing contracts
            // middle_ticks_handler.addOnGoingMarkers(contract_info);
        }
    }
};

const middleTicksHandler = (SmartChartStore, { ...contract_info }) => {
    const ticks_history_req = {
        ticks_history: contract_info.underlying,
        start        : contract_info.entry_tick_time,
        end          : contract_info.exit_tick_time,
        count        : (contract_info.tick_count + 1), // add 1 to prevent for 1-tick contracts from returning 5000 ticks
    };

    const zip = (arr, ...arrs) => arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]));

    const combinePriceTime = (price_arr, times_arr) =>
        zip(price_arr, times_arr).reduce((acc, tick) => [...acc, { price: tick[0], time: tick[1] }], []);

    const isContractTick = tick =>
        +tick.time >= +contract_info.entry_tick_time && +tick.time <= +contract_info.exit_tick_time;

    const isMiddleTick = tick => +tick.time > contract_info.entry_tick_time && tick.time < contract_info.exit_tick_time;

    const addTickToChart = (tick, idx) => {
        let marker_config;
        const is_entry  = idx === 0 && +tick.time === +contract_info.entry_tick_time;
        const is_exit   = +tick.time === +contract_info.exit_tick_time;
        const is_middle = isMiddleTick(tick);

        if (is_entry) marker_config = createMarkerSpotEntry(contract_info);
        if (is_exit) marker_config = createMarkerSpotExit(contract_info);
        if (is_middle) {
            marker_config = createMarkerSpotMiddle(tick, idx);
            marker_config.type = `${marker_config.type}_${idx}`;
        }

        if (marker_config) SmartChartStore.createMarker(marker_config);
    };

    const addTicks = ([ ...ticks_arr ]) => {
        const contract_ticks = ticks_arr
            .sort((a, b) => +a.time - +b.time)
            .filter(isContractTick);

        contract_ticks.forEach(addTickToChart);
    };

    const onCompletedContract = (data) => {
        const { prices, times } = data.history;
        const ticks = combinePriceTime(prices, times);

        addTicks(ticks);
    };

    return {
        addMarkersFromHistory: () =>
            WS.sendRequest({ ...ticks_history_req }).then((data) => onCompletedContract(data)),
    };
};

function createMarkerSpotMiddle(tick, idx) {
    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_MIDDLE.type,
        tick.time,
        tick.price,
        { spot_value: `${idx}` },
    );
}
