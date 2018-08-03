import { BARRIER_LINE_STYLES } from '../../SmartChart/Constants/barriers';

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
