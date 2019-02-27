import extend                  from 'extend';
import { WS }                  from 'Services';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createChartMarkers = (SmartChartStore, contract_info, ContractStore = null) => {
    if (contract_info) {
        Object.keys(marker_creators).forEach((marker_type) => {
            if (marker_type in SmartChartStore.markers) return;

            const marker_config = marker_creators[marker_type](contract_info, ContractStore);
            if (marker_config) {
                SmartChartStore.createMarker(marker_config);
            }
        });
    }
};

let middle_ticks_handler, is_ongoing_contract;
export const createChartTickMarkers = (SmartChartStore, contract_info, ContractStore = null) => {

    if (!middle_ticks_handler && contract_info.entry_tick_time) {
        middle_ticks_handler = initMiddleTicks(ContractStore, SmartChartStore, contract_info);
        is_ongoing_contract = !ContractStore.end_spot_time;

        if (is_ongoing_contract) middle_ticks_handler.addMarkerFromStreamHistory(contract_info);
        if (!is_ongoing_contract) middle_ticks_handler.addMarkerFromHistory(contract_info);
    }

    const stream_is_done = is_ongoing_contract && ContractStore.end_spot_time;
    if (stream_is_done) middle_ticks_handler.forgetStreamHistory();
    if (middle_ticks_handler && ContractStore.end_spot_time) {
        middle_ticks_handler = null;
        is_ongoing_contract = null;
    }
};

const initMiddleTicks = (ContractStore, SmartChartStore, contract_info) => {
    let ticks_added_to_chart = 0;

    const ticks_history_req = {
        ticks_history: contract_info.underlying,
        start        : contract_info.entry_tick_time,
        end          : ContractStore.end_spot_time ? ContractStore.end_spot_time : 'latest',
        count        : contract_info.tick_count,
    };

    const zip = (arr, ...arrs) => arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]));

    const combinePriceTime = (price_arr, times_arr) =>
        zip(price_arr, times_arr).reduce((acc, curr) => [...acc, { price: curr[0], time: curr[1] }], []);

    const addTickToChart = (tick, idx) => {
        const marker_config = createMarkerSpotMiddle(tick);
        marker_config.type = `${marker_config.type}_${idx}`;
        SmartChartStore.createMarker(marker_config);
    };

    const isMiddleTick = (tick, { entry_tick_time, tick_count }) => {
        if ((+tick.time) > entry_tick_time && ticks_added_to_chart < tick_count) {
            return true;
        }
        return false;
    };

    const on_tick = (tick) => {
        if (isMiddleTick(tick, contract_info)) {
            ticks_added_to_chart += 1;
            addTickToChart(tick, ticks_added_to_chart);
        }
    };

    const handle_finished_contract = (data) => {
        const { prices, times } = data.history;
        const middle_ticks = combinePriceTime(prices, times)
            .filter((i) => i.time > +contract_info.entry_tick_time && i.time < +ContractStore.end_spot_time);

        middle_ticks.forEach(addTickToChart);
    };

    const handle_running_contract = (data) => {
        console.log(data);
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
        addMarkerFromStreamHistory: () => {
            WS.subscribeTicksHistory({ ...ticks_history_req, subscribe: 1 }, handle_running_contract);
        },
        forgetStreamHistory: () => {
            console.log('forget');
            WS.forget('ticks_history', handle_running_contract, ticks_history_req);
        },
        addMarkerFromHistory: () => {
            WS.sendRequest({ ...ticks_history_req }).then((data) => handle_finished_contract(data));
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

function createMarkerSpotExit(contract_info, ContractStore) {
    if (!ContractStore.end_spot_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_EXIT.type,
        ContractStore.end_spot_time,
        ContractStore.end_spot,
        {
            spot_value: `${ContractStore.end_spot}`,
            status    : `${contract_info.profit > 0 ? 'won' : 'lost' }`,
        },
    );
}

function createMarkerSpotMiddle(tick) {
    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_MIDDLE.type,
        +tick.time,
        +tick.price,
        { spot_value: `${tick.price}` },
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
