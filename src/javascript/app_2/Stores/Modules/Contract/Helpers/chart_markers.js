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
    [MARKER_TYPES_CONFIG.SPOT_ENTRY.type]: createMarkerSpotEntry,
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type] : createMarkerSpotExit,
};

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
