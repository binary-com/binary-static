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
        getTicksBetweenStartAndEnd(contract_info, ContractStore);
    }
};

const getTicksBetweenStartAndEnd = (function() {
    let has_been_called = false;

    return function ({ ...contract_info }, ContractStore) {
        if (has_been_called) return;
        has_been_called = true;

        const ticks_history_req = {
            ticks_history: contract_info.underlying,
            start        : contract_info.entry_tick_time,
            end          : 'latest',
            count        : contract_info.tick_count,
        };

        if (ContractStore.end_spot_time) {
            WS.sendRequest(ticks_history_req).then((data) => {
                console.log('end spot ', data);
            });
        } else {
            WS.subscribeTicksHistory({ ...ticks_history_req, subscribe: 1 }, (data) => {
                console.log('createChartMarker: ', data);
            });
        }
    };
})();

const marker_creators = {
    [MARKER_TYPES_CONFIG.LINE_END.type]     : createMarkerEndTime,
    [MARKER_TYPES_CONFIG.LINE_PURCHASE.type]: createMarkerPurchaseTime,
    [MARKER_TYPES_CONFIG.LINE_START.type]   : createMarkerStartTime,
    [MARKER_TYPES_CONFIG.SPOT_ENTRY.type]   : createMarkerSpotEntry,
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type]    : createMarkerSpotExit,
    [MARKER_TYPES_CONFIG.SPOT_MIDDLE.type]  : createMarkerSpotMiddle,
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

function createMarkerSpotMiddle(contract_info, ContractStore) {
    // TODO: createMarkerConfig for middle spots
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
