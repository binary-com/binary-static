import extend                  from 'extend';
import { BARRIER_LINE_STYLES } from '../../SmartChart/Constants/barriers';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';
import { toMoment }            from '../../../../Utils/Date';

export const setChartBarrier = (SmartChartStore, contract_info) => {
    SmartChartStore.removeBarriers();
    if (contract_info) {
        const { contract_type, barrier, high_barrier, low_barrier } = contract_info;
        SmartChartStore.createBarriers(
            contract_type,
            barrier || high_barrier,
            low_barrier,
            null,
            {
                line_style   : BARRIER_LINE_STYLES.SOLID,
                not_draggable: true,
            },
        );
        SmartChartStore.updateBarrierShade(true, contract_type);
    }
};

export const createChartMarker = (SmartChartStore, contract_info) => {
    if (contract_info) {
        const spot_entry_config = createMarkerConfig(
            {
                type: MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
                x   : toMoment(contract_info.date_start).toDate(),
                y   : contract_info.entry_tick,
            },
            {
                value: `${contract_info.entry_tick}`,
            },
        );

        SmartChartStore.createMarker(spot_entry_config);
    }
};

export const createChartLineMarker = (SmartChartStore, line_config) => {
    if (line_config) {
        const config = createMarkerConfig(
            {
                type     : line_config.type,
                x        : toMoment(line_config.time).toDate(),
                y        : 'none',
                className: 'start-time',
            },
            {
                label: line_config.label,
            },
        );

        SmartChartStore.createMarker(config);
    }
};

const createMarkerConfig = (marker_config, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_config.type], {
        marker_config: {
            x        : marker_config.x,
            y        : marker_config.y,
            className: marker_config.className,
        },
        content_config,
    })
);
