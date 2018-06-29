import moment                        from 'moment';
import { createChartBarriersConfig } from './chart';
import { convertToUnix }             from '../../../../common/date_time';
import WS                            from '../../../../data/ws_methods';
import { getDecimalPlaces }          from '../../../../../_common/base/currency_base';

export const requestProposal = (store, updateStore) => {
    const proposal_info = {};
    WS.forgetAll('proposal').then(() => {
        const proposalCallback = (response) => {
            const proposal = response.proposal || {};
            const profit   = (proposal.payout - proposal.ask_price) || 0;
            const returns  = profit * 100 / (proposal.payout || 1);

            proposal_info[response.echo_req.contract_type] = {
                profit   : profit.toFixed(getDecimalPlaces(store.currency)),
                returns  : `${returns.toFixed(2)}%`,
                stake    : proposal.display_value,
                payout   : proposal.payout,
                id       : proposal.id || '',
                message  : proposal.longcode || response.error.message,
                has_error: !!response.error,
            };

            const chart_barriers = !store.chart_barriers.main &&
                { chart_barriers: createChartBarriersConfig(store, response) };

            updateStore(store, {
                proposal_info,
                ...(chart_barriers),
                is_purchase_enabled: true,
            });
        };

        Object.keys(store.trade_types).forEach(type => {
            WS.subscribeProposal(createProposalRequest(store, type), proposalCallback);
        });
    });
};

const createProposalRequest = (store, type_of_contract) => {
    const obj_expiry = {};
    if (store.expiry_type === 'endtime') {
        const expiry_date = moment.utc(store.expiry_date);
        const is_same_day = expiry_date.isSame(moment(store.server_time), 'day');
        const expiry_time = is_same_day ? store.expiry_time : '11:59:59';
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), expiry_time);
    }

    return {
        proposal     : 1,
        subscribe    : 1,
        amount       : parseFloat(store.amount),
        basis        : store.basis,
        contract_type: type_of_contract,
        currency     : store.currency,
        symbol       : store.symbol,
        ...(
            store.start_date &&
            { date_start: convertToUnix(store.start_date, store.start_time) }
        ),
        ...(
            store.expiry_type === 'duration' ?
            {
                duration     : parseInt(store.duration),
                duration_unit: store.duration_unit,
            }
            :
            obj_expiry
        ),
        ...(
            (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
            { barrier: store.barrier_1 || store.last_digit }
        ),
        ...(
            store.barrier_count === 2 &&
            { barrier2: store.barrier_2 }
        ),
    };
};
