import DAO from '../../../data/dao';

export const processPurchase = async(proposal_id, price) => (
    await DAO.buy(proposal_id, price)
);
