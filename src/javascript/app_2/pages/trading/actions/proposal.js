import DAO from '../../../data/dao';

export const onChangeProposalAsync = function *(store) {
    const proposal_requests = [];
    const proposals         = {};
    DAO.forgetAll('proposal').then(() => {
        const proposalCallback = (response) => {
            const id      = response.error ? '' : response.proposal.id;
            const message = response.error ? response.error.message : response.proposal.longcode;
            proposals[response.echo_req.contract_type] = { id, message };
        };

        Object.keys(store.trade_types).forEach(type => {
            proposal_requests.push(() => DAO.subscribeProposal(store, type, proposalCallback));
        });
    });

    yield Promise.all(proposal_requests);

    return {
        proposals,
    };
};
