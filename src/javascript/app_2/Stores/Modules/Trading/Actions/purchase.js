import { WS } from '../../../../Services';

export const processPurchase = async(proposal_id, price) => (
    await WS.buy(proposal_id, price)
);
