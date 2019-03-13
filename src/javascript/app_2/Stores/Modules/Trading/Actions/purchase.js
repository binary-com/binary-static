import { WS } from 'Services';

export const processPurchase = async(proposal_id, price) =>
    WS.subscribeProposalOpenContractAfterBuy({ buy: proposal_id, price });
