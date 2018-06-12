import WS from '../../../data/ws_methods';

export const processPurchase = async(proposal_id, price) => (
    await WS.buy(proposal_id, price)
);
