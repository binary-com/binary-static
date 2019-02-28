import extend                  from 'extend';
import { WS }                  from 'Services';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createChartMarkers = (SmartChartStore, contract_info, ContractStore = null) => {
    if (contract_info) {
        Object.keys(marker_creators).forEach((marker_type) => {
            if (marker_type in SmartChartStore.markers) return;

            const marker_config = marker_creators[marker_type](contract_info, ContractStore);
            if (marker_config) {
                setTimeout(() => {
                    SmartChartStore.createMarker(marker_config);
                }, 1000);
            }
        });
    }
};

let middle_ticks_handler, is_running_contract;
export const createChartTickMarkers = (SmartChartStore, contract_info) => {
    if (!middle_ticks_handler && contract_info.entry_tick_time) {
        middle_ticks_handler = getMiddleTicksHandler(SmartChartStore, contract_info);
        is_running_contract = !contract_info.exit_tick_time;
        if (is_running_contract) middle_ticks_handler.addMarkerFromStreamHistory(contract_info);
        if (!is_running_contract) middle_ticks_handler.addMarkerFromHistory(contract_info);
    }

    const stream_is_done = is_running_contract && contract_info.exit_tick_time;
    if (stream_is_done) middle_ticks_handler.forgetStreamHistory();

    if (contract_info.is_path_dependent && is_running_contract && middle_ticks_handler && contract_info.barrier) {
        middle_ticks_handler.setBarrier(contract_info);
    }

    if (middle_ticks_handler && contract_info.exit_tick_time) {
        middle_ticks_handler = null;
        is_running_contract = null;
    }
};

const getMiddleTicksHandler = (SmartChartStore, contract_info) => {
    let on_going_tick_idx = 0;
    let is_finished_before_end = false;
    let path_dependent_barrier;

    const ticks_history_req = {
        ticks_history: contract_info.underlying,
        start        : contract_info.entry_tick_time,
        end          : contract_info.exit_tick_time ? contract_info.exit_tick_time : 'latest',
        count        : contract_info.tick_count,
    };

    const zip = (arr, ...arrs) => arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]));

    const combinePriceTime = (price_arr, times_arr) =>
        zip(price_arr, times_arr).reduce((acc, tick) => [...acc, { price: tick[0], time: tick[1] }], []);

    const addTickToChart = (tick, idx) => {
        setTimeout(() => {
            const marker_config = createMarkerSpotMiddle(tick, idx);
            marker_config.type = `${marker_config.type}_${idx}`;
            SmartChartStore.createMarker(marker_config);
        }, 1000);
    };

    const isMiddleTick = (tick, { entry_tick_time, tick_count }) =>
        (+tick.time > entry_tick_time && on_going_tick_idx < (tick_count - 1));

    const on_tick = (tick) => {
        if (isMiddleTick(tick, contract_info) && !is_finished_before_end) {
            if (path_dependent_barrier && +tick.price >= path_dependent_barrier) {
                is_finished_before_end = true;
                return;
            }
            on_going_tick_idx += 1;
            addTickToChart(tick, on_going_tick_idx);
        }
    };

    const onCompletedContract = (data) => {
        const { prices, times } = data.history;
        const middle_ticks = combinePriceTime(prices, times)
            .filter((tick) => tick.time > +contract_info.entry_tick_time && tick.time < +contract_info.exit_tick_time);

        middle_ticks.forEach((tick, idx) => addTickToChart(tick, idx + 1));
    };

    const onRunningContract = (data) => {
        if (data.tick) {
            const tick = { price: data.tick.quote, time: data.tick.epoch };
            on_tick(tick, contract_info);
        }
        if (data.history) {
            const { prices, times } = data.history;
            combinePriceTime(prices, times).forEach(tick => on_tick(tick));
        }
    };

    return {
        addMarkerFromStreamHistory: () =>
            WS.subscribeTicksHistory({ ...ticks_history_req, subscribe: 1 }, onRunningContract),
        forgetStreamHistory: () =>
            WS.forget('ticks_history', onRunningContract, ticks_history_req),
        addMarkerFromHistory: () =>
            WS.sendRequest({ ...ticks_history_req }).then((data) => onCompletedContract(data)),
        setBarrier: (ci) => {
            path_dependent_barrier = ci.barrier;
        },
    };
};

const marker_creators = {
    [MARKER_TYPES_CONFIG.LINE_END.type]     : createMarkerEndTime,
    [MARKER_TYPES_CONFIG.LINE_PURCHASE.type]: createMarkerPurchaseTime,
    [MARKER_TYPES_CONFIG.LINE_START.type]   : createMarkerStartTime,
    [MARKER_TYPES_CONFIG.SPOT_ENTRY.type]   : createMarkerSpotEntry,
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type]    : createMarkerSpotExit,
};

// -------------------- Lines --------------------
function createMarkerEndTime(contract_info) {
    if (contract_info.status === 'open' || !contract_info.date_expiry) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_END.type,
        contract_info.date_expiry,
    );
}

function createMarkerPurchaseTime(contract_info) {
    if (!contract_info.purchase_time || !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_PURCHASE.type,
        contract_info.purchase_time,
    );
}

function createMarkerStartTime(contract_info) {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_START.type,
        contract_info.date_start,
    );
}

// -------------------- Spots --------------------
function createMarkerSpotEntry(contract_info, ContractStore) {
    if (!contract_info.entry_tick_time || ContractStore.is_sold_before_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
        contract_info.entry_tick_time,
        contract_info.entry_tick,
        {
            // spot_value: `${contract_info.entry_tick}`,
        },
    );
}

function createMarkerSpotExit(contract_info) {
    if (!contract_info.exit_tick_time) return false;

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

function createMarkerSpotMiddle(tick, idx) {
    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_MIDDLE.type,
        tick.time,
        tick.price,
        { spot_value: `${idx}` },
    );
}

// -------------------- Helpers --------------------
const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x: +x,
            y,
        },
        content_config,
    })
);
