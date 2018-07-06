import { observable } from 'mobx';

class ChartBarriersConfig {
    @observable color;
    @observable lineStyle;
    @observable shade;

    constructor({ barrier, barrier2 }) {
        this.color     = 'green';
        this.lineStyle = 'dashed';
        this.shade     = 'NONE_SINGLE';

        this.high = +barrier || 0; // 0 to follow the price
        if (barrier2) {
            this.low   = +barrier2;
            this.shade = 'NONE_DOUBLE';
        }

        const has_barrier   = !!barrier;
        this.relative       = !has_barrier || /^[+-]/.test(barrier);
        this.draggable      = has_barrier;
        this.hidePriceLines = !has_barrier;
    }
}

export const createChartBarriersConfig = (contract_type, proposal_response) => {
    if (proposal_response.error || !/(rise_fall|high_low|touch|end|stay)/.test(contract_type)) {
        return {};
    }

    return new ChartBarriersConfig(proposal_response.echo_req);
};

export const updateBarrierShade = (chart_barriers, is_over, contract_type) => {
    const config = chart_barriers.main;
    if (!config) return false;

    return (is_over &&
        Object.keys(SHADE_TYPES).find(key => SHADE_TYPES[key].includes(contract_type))
    ) || getDefaults(config);
};

const getDefaults = (config = {}) => 'high' in config && 'low' in config ? 'NONE_DOUBLE' : 'NONE_SINGLE';

const SHADE_TYPES = {
    ABOVE  : ['CALL'],
    BELOW  : ['PUT'],
    BETWEEN: ['EXPIRYRANGE', 'RANGE'],
    OUTSIDE: ['EXPIRYMISS', 'UPORDOWN'],
};
