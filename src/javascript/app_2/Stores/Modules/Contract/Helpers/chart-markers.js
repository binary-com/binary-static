import {
    createMarkerConfig,
    createMarkerSpotEntry,
    createMarkerSpotExit }     from './chart-marker-helpers';
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
