import {
    createMarkerExpiry,
    createMarkerPurchaseTime,
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerStartTime,
    createMarkerSpotMiddle }     from './chart-marker-helpers';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

function unique(array, propertyName) {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

export const createChartMarkers = (SmartChartStore, contract_info) => {
    if (contract_info) {
        // contract_info_arr:

        // ==== TICKS ====
        // TODO: Align label

        if (contract_info.tick_count) {
            addTickMarker(contract_info);
        } else {
            addMarker(marker_spots);
        }

        addMarker(marker_lines);
    }

    function addMarker(marker_obj) {
        Object.keys(marker_obj).forEach(createMarker);

        function createMarker(marker_type) {
            if (marker_type in SmartChartStore.markers) return;

            const marker_config = marker_obj[marker_type](contract_info);
            if (marker_config) {
                SmartChartStore.createMarker(marker_config);
            }
        }
    }

    function addTickMarker() {
        let { tick_stream } = contract_info;
        tick_stream = unique(tick_stream, 'epoch');

        tick_stream.forEach((tick, idx) => {
            let marker_config;
            if (idx === 0) marker_config = createMarkerSpotEntry(contract_info);
            if (idx > 0 && +tick.epoch !== contract_info.exit_tick_time) {
                marker_config = createMarkerSpotMiddle(contract_info, tick, idx);
            }
            if (idx > 0 && +tick.epoch === contract_info.exit_tick_time) {
                marker_config = createMarkerSpotExit(contract_info, tick, idx);
            }

            if (marker_config) {
                if (marker_config.type in SmartChartStore.markers) return;

                SmartChartStore.createMarker(marker_config);
            }
        });
    }
};

const marker_spots = {
    [MARKER_TYPES_CONFIG.SPOT_ENTRY.type]: createMarkerSpotEntry,
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type] : createMarkerSpotExit,
};

const marker_lines = {
    [MARKER_TYPES_CONFIG.LINE_START.type]   : createMarkerStartTime,
    [MARKER_TYPES_CONFIG.LINE_END.type]     : createMarkerExpiry,
    [MARKER_TYPES_CONFIG.LINE_PURCHASE.type]: createMarkerPurchaseTime,
};
