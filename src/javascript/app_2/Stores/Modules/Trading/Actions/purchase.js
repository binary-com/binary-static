import { WS } from 'Services';

export const processPurchase = async(proposal_id, price) =>
    WS.subscribeProposalOpenContractAfterBuy(
        proposal_id,
        { buy: proposal_id, price },
    );
