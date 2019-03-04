import { WS }                  from 'Services';
import { createMarkerConfig } from './chart-marker-helpers';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

let has_been_initialized = false;
let middle_ticks_handler;

export const createChartTickMarkers = (SmartChartStore, contract_info) => {
    if (!has_been_initialized && contract_info.entry_tick_time) {
        console.log(contract_info.entry_tick_time);
        middle_ticks_handler = getMiddleTicksHandler(SmartChartStore, contract_info);
        has_been_initialized = true;

        if (!contract_info.exit_tick_time) {
            middle_ticks_handler.addMarkerFromStreamHistory(contract_info.entry_tick_time);
        } else {
            middle_ticks_handler.addMarkerFromHistory(contract_info);
        }
    }
    if (contract_info.exit_tick_time && middle_ticks_handler) {
        middle_ticks_handler.addExitTick(contract_info);
        middle_ticks_handler.forgetStreamHistory(contract_info);
    }
    // if (contract_info.is_path_dependent && is_running_contract && middle_ticks_handler && contract_info.barrier) {
    //     middle_ticks_handler.handlePathDependentMarkers(contract_info);
    // }
};

export const cleanUpTickMarkers = (contract_info) => {
    if (middle_ticks_handler) {
        middle_ticks_handler.forgetStreamHistory(contract_info);
        middle_ticks_handler = null;
    }
    has_been_initialized = false;
};

const getMiddleTicksHandler = (SmartChartStore, contract_info) => {
    let on_going_tick_idx = 0;
    let is_finished_before_end = false;
    let draw_timeout = 0;
    let has_stream = false;
    let path_dependent_barrier, first_tick_time, is_getting_history;
    const added_ticks = [];
    const stream_ticks = [];

    const ticks_history_req = {
        ticks_history: contract_info.underlying,
        start        : contract_info.entry_tick_time,
        end          : contract_info.exit_tick_time ? contract_info.exit_tick_time : 'latest',
        count        : (contract_info.tick_count + 1),
    };

    const zip = (arr, ...arrs) => arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]));
    const unique = (arr_objects, key) => arr_objects.reduce((prev, curr) =>
        prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);

    const combinePriceTime = (price_arr, times_arr) =>
        zip(price_arr, times_arr).reduce((acc, tick) => [...acc, { price: tick[0], time: tick[1] }], []);

    const addTickToChart = (tick, idx, ci) => {
        setTimeout(() => {
            let marker_config;
            const is_entry = idx === 0 && +tick.time === +contract_info.entry_tick_time;
            const is_exit = ci && +tick.time === +ci.exit_tick_time;
            const is_middle = idx !== contract_info.tick_count && !is_exit && !is_entry;

            if (is_entry) marker_config = createMarkerSpotEntry(tick, idx);
            if (is_exit) {
                marker_config = createMarkerSpotExit(ci);
                console.log(added_ticks);
            }
            if (is_middle) {
                marker_config = createMarkerSpotMiddle(tick, idx);
                marker_config.type = `${marker_config.type}_${idx}`;
            }
            if (marker_config) SmartChartStore.createMarker(marker_config);
        }, draw_timeout);
    };

    const isContractTick = (tick, { entry_tick_time, tick_count }) =>
        (+tick.time >= entry_tick_time && on_going_tick_idx <= (tick_count - 1));

    const onTick = (tick) => {
        if (isContractTick(tick, contract_info) && !is_finished_before_end) {
            if (path_dependent_barrier && +tick.price >= path_dependent_barrier) {
                is_finished_before_end = true;
                return;
            }
            const has_been_added = added_ticks.find((t) => +t.time === +tick.time);
            if (!has_been_added) {
                added_ticks.push({ ...tick, on_going_tick_idx });
                addTickToChart(tick, on_going_tick_idx);
                on_going_tick_idx += 1;
            }
        }
    };

    const onCompletedContract = (data) => {
        const { prices, times } = data.history;
        let contract_ticks = combinePriceTime(prices, times);
        contract_ticks = [...contract_ticks, ...stream_ticks]
            .sort((a, b) => +a.time - b.time)
            .filter((tick) => +tick.time >= +contract_info.entry_tick_time);
        contract_ticks = unique(contract_ticks, 'time');

        contract_ticks.forEach((tick) => {
            const has_been_added = added_ticks.find((t) => +t.time === +tick.time);
            if (!has_been_added) {
                added_ticks.push({ ...tick, on_going_tick_idx });
                addTickToChart(tick, on_going_tick_idx);
                on_going_tick_idx += 1;
            }
        });
    };

    const onRunningContract = (data) => {
        if (data.tick) {
            const tick = { price: data.tick.quote, time: data.tick.epoch };
            if (!first_tick_time) {
                first_tick_time = tick.time;
            }
            stream_ticks.push(tick);
            if (!is_getting_history) onTick(tick, contract_info);
        }
        if (data.history) {
            const { prices, times } = data.history;
            combinePriceTime(prices, times).forEach(tick => onTick(tick));
        }
    };
    
    return {
        addMarkerFromStreamHistory: (start) => {
            draw_timeout = 1500;
            has_stream = true;

            WS.sendRequest({ ...ticks_history_req, start }).then((data) => onCompletedContract(data));
            WS.subscribeTicksHistory({ ...ticks_history_req, subscribe: 1 }, onRunningContract, false);
        },
        forgetStreamHistory: () =>{
            if (!has_stream) return;

            WS.forget('ticks_history', onRunningContract, ticks_history_req);
        },
        addMarkerFromHistory: () =>
            WS.sendRequest(ticks_history_req).then((data) => onCompletedContract(data)),
        handlePathDependentMarkers: (ci) => {
            path_dependent_barrier = ci.barrier;
        },
        addExitTick: (ci) => {
            addTickToChart({ price: ci.exit_tick, time: ci.exit_tick_time }, ci.tick_count, ci);
        },
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

function createMarkerSpotEntry(tick) {
    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
        tick.time,
        tick.price,
    );
}

function createMarkerSpotExit(contract_info) {
    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_EXIT.type,
        contract_info.exit_tick_time,
        contract_info.exit_tick,
        {
            spot_value: `${contract_info.exit_tick}`,
            status    : `${contract_info.profit > 0 ? 'won' : 'lost' }`,
        },
    );
}
