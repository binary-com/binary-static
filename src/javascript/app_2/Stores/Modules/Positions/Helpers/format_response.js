export const formatPositionsPosition = (positions_pos) => {
    const purchase = parseFloat(positions_pos.buy_price);
    const payout   = parseFloat(positions_pos.payout);

    return {
        reference  : +positions_pos.transaction_id,
        type       : positions_pos.contract_type,
        details    : positions_pos.longcode.replace(/\n/g, '<br />'),
        payout,
        purchase,
        expiry_time: positions_pos.expiry_time,
        id         : positions_pos.contract_id,
        indicative : 0,
    };
};
