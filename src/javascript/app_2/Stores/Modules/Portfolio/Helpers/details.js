import { localize }   from '_common/localize';
import {
    epochToMoment,
    getDiffDuration } from 'Utils/Date';

export const getDurationUnitValue = (obj_duration) => {
    const duration_ms = obj_duration.asMilliseconds() / 1000;

    if (duration_ms >= 86400000) {
        return Math.floor(duration_ms / (1000 * 60 * 60 * 24));
    } else if (duration_ms >= 3600000 && duration_ms < 86400000) {
        return Math.floor(duration_ms / (1000 * 60 * 60));
    } else if (duration_ms >= 60000 && duration_ms < 3600000) {
        return Math.floor(duration_ms / (1000 * 60));
    } else if (duration_ms >= 1000 && duration_ms < 60000) {
        return Math.floor(duration_ms / (1000));
    }
    return Math.floor(duration_ms / (1000));
};

export const getDurationUnitText = (obj_duration) => {
    const unit_map = {
        s: { name: localize('seconds') },
        m: { name: localize('minutes') },
        h: { name: localize('hours') },
        d: { name: localize('days') },
    };
    const duration_ms = obj_duration.asMilliseconds() / 1000;
    if (duration_ms) {
        if (duration_ms >= 86400000) {
            return (duration_ms === 8640000) ? unit_map.d.name.slice(0, -1) : unit_map.d.name;
        } else if (duration_ms >= 3600000 && duration_ms < 86400000) {
            return (duration_ms === 360000) ? unit_map.h.name.slice(0, -1) : unit_map.h.name;
        } else if (duration_ms >= 60000 && duration_ms < 3600000) {
            return (duration_ms === 60000) ? unit_map.m.name.slice(0, -1) : unit_map.m.name;
        } else if (duration_ms >= 1000 && duration_ms < 60000) {
            return unit_map.s.name;
        }
    }
    return unit_map.s.name;
};

export const getDurationPeriod = (contract_info) => (
    getDiffDuration(
        epochToMoment(contract_info.purchase_time || contract_info.date_start),
        epochToMoment(contract_info.date_expiry)
    )
);

export const getDurationTime = (contract_info) => (
    contract_info.tick_count ?
        contract_info.tick_count
        :
        getDurationUnitValue(getDurationPeriod(contract_info))
);
