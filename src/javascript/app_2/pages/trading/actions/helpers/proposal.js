import { convertDateTimetoUnix } from '../../../../common/date_time';
import DAO                       from '../../../../data/dao';

export const requestProposal = (store, updateStore) => {
    const proposals         = {};
    DAO.forgetAll('proposal').then(() => {
        const proposalCallback = (response) => {
            const id      = response.error ? '' : response.proposal.id;
            const message = response.error ? response.error.message : response.proposal.longcode;
            proposals[response.echo_req.contract_type] = { id, message };
            updateStore(store, { proposals });
        };

        Object.keys(store.trade_types).forEach(type => {
            DAO.subscribeProposal(makeProposalRequest(store, type), proposalCallback);
        });
    });
};

const makeProposalRequest = (store, type_of_contract) => {
    const proposal = store.proposal;
    return {
        proposal     : 1,
        subscribe    : 1,
        amount       : parseFloat(proposal.amount),
        basis        : proposal.basis,
        contract_type: type_of_contract,
        currency     : proposal.currency,
        symbol       : proposal.symbol,
        ...(
            proposal.start_date !== 'now' &&
            { date_start: convertDateTimetoUnix(proposal.start_date, proposal.start_time) }
        ),
        ...(
            proposal.expiry_type === 'duration' ?
            {
                duration     : parseInt(proposal.duration),
                duration_unit: proposal.duration_unit,
            }
            :
            { date_expiry: convertDateTimetoUnix(proposal.expiry_date, proposal.expiry_time) }
        ),
        ...(
            (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
            { barrier: proposal.barrier_1 || proposal.last_digit }
        ),
        ...(
            store.barrier_count === 2 &&
            { barrier2: proposal.barrier_2 }
        ),
    };
};
