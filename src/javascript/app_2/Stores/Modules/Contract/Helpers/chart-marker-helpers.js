import extend                  from 'extend';
import { isDigitContract }     from 'Stores/Modules/Contract/Helpers/digits';
import {
    getEndSpotTime,
    isUserSold }               from 'Stores/Modules/Contract/Helpers/logic';
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

const getSpotCount = (contract_info, spot_count) =>
    isDigitContract(contract_info.contract_type) ? spot_count + 1 : spot_count;

// -------------------- Lines --------------------
export const createMarkerExpiry = (contract_info) => {
    const end_spot_time = getEndSpotTime(contract_info);

    if (contract_info.status === 'open' || !end_spot_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_END.type,
        +end_spot_time,
    );
};

export const createMarkerPurchaseTime = (contract_info) => {
    if (!contract_info.purchase_time || !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_PURCHASE.type,
        +contract_info.purchase_time,
    );
};

export const createMarkerStartTime = (contract_info) => {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_START.type,
        +contract_info.date_start,
    );
};

// -------------------- Spots --------------------
export const createMarkerSpotEntry = (contract_info) => {
    if (!contract_info.entry_tick_time) return false;

    let marker_type      = MARKER_TYPES_CONFIG.SPOT_ENTRY.type;
    let component_props  = {};
    const spot_has_label = isDigitContract(contract_info.contract_type);

    if (spot_has_label) {
        marker_type = MARKER_TYPES_CONFIG.SPOT_MIDDLE.type;
        const spot_count = 1;

        component_props = {
            spot_value: +contract_info.entry_tick,
            spot_epoch: +contract_info.entry_tick_time,
            spot_count,
        };
    }

    return createMarkerConfig(
        marker_type,
        contract_info.entry_tick_time,
        contract_info.entry_tick,
        component_props,
    );
};

export const createMarkerSpotExit = (contract_info, tick, idx) => {
    if (!contract_info.exit_tick_time || isUserSold(contract_info)) return false;
    const spot_count = getSpotCount(contract_info, idx);

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_EXIT.type,
        +tick.epoch,
        +tick.tick,
        {
            spot_value : `${tick.tick}`,
            spot_epoch : `${tick.epoch}`,
            status     : `${contract_info.profit && contract_info.profit > 0 ? 'won' : 'lost' }`,
            align_label: tick.align_label,
            spot_count,
        },
    );
};

export const createMarkerSpotMiddle = (contract_info, tick, idx) => {
    const spot_count = getSpotCount(contract_info, idx);

    const marker_config = createMarkerConfig(
        MARKER_TYPES_CONFIG.SPOT_MIDDLE.type,
        +tick.epoch,
        +tick.tick,
        {
            spot_value : `${tick.tick}`,
            spot_epoch : `${tick.epoch}`,
            align_label: tick.align_label,
            spot_count,
        },
    );
    marker_config.type = `${marker_config.type}_${idx}`;

    return marker_config;
};
