import { localize } from '_common/localize';

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
            return unit_map.d.name;
        } else if (duration_ms >= 3600000 && duration_ms < 86400000) {
            return unit_map.h.name;
        } else if (duration_ms >= 60000 && duration_ms < 3600000) {
            return unit_map.m.name;
        } else if (duration_ms >= 1000 && duration_ms < 60000) {
            return unit_map.s.name;
        }
    }
    return unit_map.s.name;
};
