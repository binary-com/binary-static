import { getDecimalPlaces }      from '../../../../../_common/base/currency_base';
import { convertDateTimetoUnix } from '../../../../common/date_time';
import DAO                       from '../../../../data/dao';

export const requestProposal = (store, updateStore) => {
    const proposal_info = {};
    DAO.forgetAll('proposal').then(() => {
        const proposalCallback = (response) => {
            const proposal = response.proposal || {};
            const profit   = (proposal.payout - proposal.ask_price) || 0;
            const returns  = profit * 100 / (proposal.payout || 1);

            proposal_info[response.echo_req.contract_type] = {
                profit : profit.toFixed(getDecimalPlaces(store.currency)),
                returns: returns.toFixed(2),
                stake  : proposal.display_value,
                payout : proposal.payout,
                id     : proposal.id || '',
                message: proposal.longcode || response.error.message,
            };

            updateStore(store, { proposal_info });
        };

        Object.keys(store.trade_types).forEach(type => {
            DAO.subscribeProposal(makeProposalRequest(store, type), proposalCallback);
        });
    });
};

const makeProposalRequest = (store, type_of_contract) => ({
    proposal     : 1,
    subscribe    : 1,
    amount       : parseFloat(store.amount),
    basis        : store.basis,
    contract_type: type_of_contract,
    currency     : store.currency,
    symbol       : store.symbol,
    ...(
        store.start_date !== 'now' &&
        { date_start: convertDateTimetoUnix(store.start_date, store.start_time) }
    ),
    ...(
        store.expiry_type === 'duration' ?
        {
            duration     : parseInt(store.duration),
            duration_unit: store.duration_unit,
        }
        :
        { date_expiry: convertDateTimetoUnix(store.expiry_date, store.expiry_time) }
    ),
    ...(
        (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
        { barrier: store.barrier_1 || store.last_digit }
    ),
    ...(
        store.barrier_count === 2 &&
        { barrier2: store.barrier_2 }
    ),
});
