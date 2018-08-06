import extend                  from 'extend';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createChartMarkers = (SmartChartStore, contract_info) => {
    if (contract_info) {
        Object.keys(marker_creators).forEach((marker_type) => {
            if (marker_type in SmartChartStore.markers) return;

            const marker_config = marker_creators[marker_type](contract_info);
            if (marker_config) {
                SmartChartStore.createMarker(marker_config);
            }
        });
    }
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
        epochToMarkerDate(contract_info.date_expiry),
    );
}

function createMarkerPurchaseTime(contract_info) {
    if (!contract_info.purchase_time || !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_PURCHASE.type,
        epochToMarkerDate(contract_info.purchase_time),
    );
}

function createMarkerStartTime(contract_info) {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_START.type,
        epochToMarkerDate(contract_info.date_start),
    );
}

// -------------------- Spots --------------------
function createMarkerSpotEntry(contract_info) {
    if (!contract_info.entry_tick_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
        epochToMarkerDate(contract_info.entry_tick_time),
        contract_info.entry_tick,
        {
            spot_value: `${contract_info.entry_tick}`,
        },
    );
}

function createMarkerSpotExit(contract_info) {
    if (!contract_info.exit_spot_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_EXIT.type,
        epochToMarkerDate(contract_info.exit_spot_time),
        contract_info.exit_tick,
        {
            spot_value: `${contract_info.exit_tick}`,
            status    : `${contract_info.profit > 0 ? 'won' : 'lost' }`,
        },
    );
}

// -------------------- Helpers --------------------
const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x,
            y,
        },
        content_config,
    })
);

// TODO: remove this function once SmartCharts accepts epoch instead of Date
const epochToMarkerDate = (epoch) => new Date((epoch + new Date().getTimezoneOffset() * 60) * 1000);
