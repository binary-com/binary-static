import { WS }                  from 'Services';
import { createMarkerConfig } from './chart-marker-helpers';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

let has_been_initialized = false;
let middle_ticks_handler;

// 1. add stream
// 2. Cache ticks until contract has entry_tick_time
// 3. Filter cached ticks
// 4. Add cached ticks to chart
// 5. If entry_tick_time not in cached ticks send history request
// 6. Wait for history request, populate markers
export const createChartTickMarkers = (SmartChartStore, contract_info) => {
    if (!has_been_initialized) {
        middle_ticks_handler = getMiddleTicksHandler(SmartChartStore, contract_info);
        has_been_initialized = true;

        if (!contract_info.exit_tick_time) {
            middle_ticks_handler.addMarkerFromStreamHistory(contract_info.entry_tick_time);
        } else {
            middle_ticks_handler.addMarkerFromHistory(contract_info);
        }
    }

    if (has_been_initialized && contract_info.entry_tick_time) {
        middle_ticks_handler.updateContract(contract_info);
    }

    if (contract_info.exit_tick_time && middle_ticks_handler) {
        middle_ticks_handler.addExitTick(contract_info);
        middle_ticks_handler.forgetStreamHistory(contract_info);
    }

};

export const cleanUpTickMarkers = (contract_info) => {
    if (middle_ticks_handler) {
        middle_ticks_handler.forgetStreamHistory(contract_info);
        middle_ticks_handler = null;
    }
    has_been_initialized = false;
};

const getMiddleTicksHandler = (SmartChartStore, contract) => {
    let on_going_tick_idx = 0;
    let is_finished_before_end = false;
    let draw_timeout = 0;
    let has_stream = false;
    let should_cache_ticks = false;
    const added_ticks = [];
    let stream_ticks = [];
    let contract_info = { ...contract };

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
            if (contract_info.is_path_dependent && +tick.price >= +contract_info.barrier) {
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

    const addTicks = (ticks_arr) => {
        let contract_ticks = [...ticks_arr]
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

    const onCompletedContract = (data) => {
        const { prices, times } = data.history;
        const contract_ticks = combinePriceTime(prices, times);
        addTicks([...contract_ticks, ...stream_ticks]);
        should_cache_ticks = false;
    };

    const onRunningContract = (data) => {
        if (data.tick) {
            const tick = { price: data.tick.quote, time: data.tick.epoch };
            stream_ticks.push(tick);

            if (!should_cache_ticks) onTick(tick, contract_info);
        }
        if (data.history) {
            const { prices, times } = data.history;
            const combined = combinePriceTime(prices, times);
            stream_ticks = [...stream_ticks, ...combined];
        }
    };
    
    return {
        addMarkerFromStreamHistory: () => {
            draw_timeout = 1500;
            has_stream = true;
            if (!contract_info.entry_tick_time) {
                should_cache_ticks = true;
            }
            WS.subscribeTicksHistory({ ...ticks_history_req, subscribe: 1 }, onRunningContract, false);
        },
        forgetStreamHistory: () =>{
            if (!has_stream) return;

            WS.forget('ticks_history', onRunningContract, ticks_history_req);
        },
        addMarkerFromHistory: () =>
            WS.sendRequest({ ...ticks_history_req }).then((data) => onCompletedContract(data)),
        addExitTick: (ci) => {
            addTickToChart({ price: ci.exit_tick, time: ci.exit_tick_time }, ci.tick_count, ci);
        },
        updateContract: (ci) => {
            if (!has_stream) return;

            contract_info = { ...ci };
            stream_ticks = stream_ticks.filter((t) => t.time >= ci.entry_tick_time);

            if (stream_ticks.length > 0) {
                addTicks([...stream_ticks]);
                should_cache_ticks = false;
            } else {
                WS.sendRequest({ ...ticks_history_req, start: ci.entry_tick_time })
                    .then((data) => onCompletedContract(data));
            }
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
