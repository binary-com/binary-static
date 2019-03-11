import extend                  from 'extend';
import { isDigitContract }     from 'Stores/Modules/Contract/Helpers/digits';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x: +x,
            y,
        },
        content_config,
    })
);

// -------------------- Lines --------------------
export const createMarkerExpiry = (contract_info) => {
    if (contract_info.status === 'open' || !contract_info.date_expiry) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_END.type,
        contract_info.date_expiry,
    );
};

export const createMarkerPurchaseTime = (contract_info) => {
    if (!contract_info.purchase_time || !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_PURCHASE.type,
        contract_info.purchase_time,
    );
};

export const createMarkerStartTime = (contract_info) => {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_START.type,
        contract_info.date_start,
    );
};

// -------------------- Spots --------------------
export const createMarkerSpotEntry = (contract_info) => {
    if (!contract_info.entry_tick_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
        contract_info.entry_tick_time,
        contract_info.entry_tick,
    );
};

export const createMarkerSpotExit = (contract_info, idx, align_label) => {
    if (!contract_info.exit_tick_time) return false;
    const spot_count = isDigitContract(contract_info.contract_type) ? '' : idx;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_EXIT.type,
        contract_info.exit_tick_time,
        contract_info.exit_tick,
        {
            spot_value: `${contract_info.exit_tick}`,
            status    : `${contract_info.profit > 0 ? 'won' : 'lost' }`,
            spot_count,
            align_label,
        },
    );
};

export const createMarkerSpotMiddle = (tick, idx, align_label) => {
    const marker_config = createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_MIDDLE.type,
        tick.time,
        tick.price,
        {
            spot_value: `${tick.price}`,
            spot_count: idx,
            align_label,
        },
    );
    marker_config.type = `${marker_config.type}_${idx}`;

    return marker_config;
};
