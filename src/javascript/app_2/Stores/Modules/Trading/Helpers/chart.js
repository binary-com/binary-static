import { action, computed, observable } from 'mobx';

export const createChartBarriersConfig = (contract_type, proposal_response, onChartBarrierChange) => {
    if (proposal_response.error || !isBarrierSupported(contract_type)) {
        return {};
    }

    return new ChartBarriersConfig(proposal_response.echo_req, onChartBarrierChange);
};

const isBarrierSupported = (contract_type) => contract_type in CONTRACT_SHADES;

class ChartBarriersConfig {
    @observable color;
    @observable lineStyle;
    @observable shade;

    @observable high;
    @observable low;

    @observable relative;
    @observable draggable;
    @observable hidePriceLines;

    onChartBarrierChange;

    constructor({ barrier, barrier2 }, onChartBarrierChange) {
        this.color     = 'green';
        this.lineStyle = 'dashed';
        this.onChange  = this.onBarrierChange;

        // trade_store's action to process new barriers on dragged
        this.onChartBarrierChange = onChartBarrierChange.bind(this);

        this.high = +barrier || 0; // 0 to follow the price
        if (barrier2) {
            this.low = +barrier2;
        }

        this.shade = this.default_shade;

        const has_barrier   = !!barrier;
        this.relative       = !has_barrier || /^[+-]/.test(barrier);
        this.draggable      = has_barrier;
        this.hidePriceLines = !has_barrier;
    }

    @action.bound
    updateBarriers({ high, low }) {
        this.high = +high || undefined;
        this.low  = +low  || undefined;
    }

    @action.bound
    updateBarrierShade(chart_barriers, is_over, contract_type) {
        this.shade = (is_over && CONTRACT_SHADES[contract_type]) || this.default_shade;
    }

    @action.bound
    onBarrierChange({ high, low }) {
        this.updateBarriers({ high, low });
        this.onChartBarrierChange(...barriersToString(this.relative, high, low));
    }

    @computed
    get barrier_count() {
        return (typeof this.high !== 'undefined') + (typeof this.low !== 'undefined');
    }

    @computed
    get default_shade() {
        return DEFAULT_SHADES[this.barrier_count];
    };
}

const barriersToString = (is_relative, ...barriers_list) => barriers_list.map(
    barrier => `${is_relative && !/^[+-]/.test(barrier) ? '+' : ''}${barrier}`
);

const CONTRACT_SHADES = {
    CALL       : 'ABOVE',
    PUT        : 'BELOW',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS : 'OUTSIDE',
    RANGE      : 'BETWEEN',
    UPORDOWN   : 'OUTSIDE',
    ONETOUCH   : 'NONE_SINGLE', // no shade
    NOTOUCH    : 'NONE_SINGLE', // no shade
};

// Default non-shade according to number of barriers
const DEFAULT_SHADES = {
    1: 'NONE_SINGLE',
    2: 'NONE_DOUBLE',
};
