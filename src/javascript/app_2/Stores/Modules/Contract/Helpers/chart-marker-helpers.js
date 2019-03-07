import extend                  from 'extend';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x: +x,
            y,
        },
        content_config,
    })
);

// -------------------- Spots --------------------
export const createMarkerSpotEntry = (contract_info) => {
    if (!contract_info.entry_tick_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
        contract_info.entry_tick_time,
        contract_info.entry_tick,
    );
};

export const createMarkerSpotExit = (contract_info) => {
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
};
