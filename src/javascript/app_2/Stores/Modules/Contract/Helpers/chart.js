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
            MARKER_TYPES_CONFIG.SPOT_ENTRY.type,
            toMoment(contract_info.date_start).toDate(),
            contract_info.entry_tick,
            {
                value: `${contract_info.entry_tick}`,
            },
        );

        SmartChartStore.createMarker(spot_entry_config);
    }
};

const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x,
            y,
        },
        content_config,
    })
);
