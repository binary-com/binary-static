import { action, observable } from 'mobx';

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
        this.shade     = 'NONE_SINGLE';
        this.onChange  = this.onBarrierChange;

        // trade_store's action to process new barriers on dragged
        this.onChartBarrierChange = onChartBarrierChange.bind(this);

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

    @action.bound
    updateBarriers({ high, low }) {
        this.high = +high || undefined;
        this.low  = +low || undefined;
    }

    @action.bound
    updateBarrierShade(chart_barriers, is_over, contract_type) {
        this.shade = (is_over && CONTRACT_SHADES[contract_type]) || this.getDefaults();
    }

    @action.bound
    onBarrierChange({ high, low }) {
        this.updateBarriers({ high, low });
        this.onChartBarrierChange();
    }

    @action.bound
    getDefaults = () => (
        typeof this.high !== 'undefined' &&
        typeof this.low !== 'undefined' ?
            'NONE_DOUBLE' :
            'NONE_SINGLE'
    );
}

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
