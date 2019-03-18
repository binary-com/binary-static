export const formatPortfolioPosition = (portfolio_pos) => {
    const purchase = parseFloat(portfolio_pos.buy_price);
    const payout   = parseFloat(portfolio_pos.payout);

    return {
        details        : portfolio_pos.longcode.replace(/\n/g, '<br />'),
        expiry_time    : portfolio_pos.expiry_time,
        id             : portfolio_pos.contract_id,
        indicative     : 0,
        payout,
        purchase,
        reference      : +portfolio_pos.transaction_id,
        type           : portfolio_pos.contract_type,
        underlying_code: portfolio_pos.symbol,
    };
};
