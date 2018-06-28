export const createChartBarriersConfig = (store, proposal_response) => {
    if (proposal_response.error || !/(rise_fall|high_low|touch|end|stay)/.test(store.contract_type)) {
        return {};
    }

    const config = {
        color    : 'green',
        lineStyle: 'dashed',
        shade    : 'NONE_SINGLE',
    };

    const { barrier, barrier2 } = proposal_response.echo_req;
    const has_barrier = !!barrier;

    Object.assign(config, {
        high: +barrier || 0, // 0 to follow the price
        ...(!!barrier2 && {
            low  : +barrier2,
            shade: 'NONE_DOUBLE',
        }),
        relative      : !has_barrier || /^[+-]/.test(barrier),
        draggable     : has_barrier,
        hidePriceLines: !has_barrier,
    });

    return { main: config };
};

export const updateBarrierShade = (store, is_over, contract_type) => {
    const config = store.chart_barriers.main;
    if (!config) return false;

    const shade = (is_over &&
        Object.keys(shade_map).find(key => shade_map[key].includes(contract_type))
    ) || getDefaults(config);

    return Object.assign(config, { shade });
};

const shade_map = {
    ABOVE  : ['CALL'],
    BELOW  : ['PUT'],
    BETWEEN: ['EXPIRYRANGE', 'RANGE'],
    OUTSIDE: ['EXPIRYMISS', 'UPORDOWN'],
};

const getDefaults = (config = {}) => 'high' in config && 'low' in config ? 'NONE_DOUBLE' : 'NONE_SINGLE';
