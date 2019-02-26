import {
    epochToMoment,
    getDiffDuration }      from 'Utils/Date';
import {
    getDurationUnitText,
    getDurationUnitValue } from './details';

export const formatPortfolioPosition = (portfolio_pos) => {
    const duration_diff =
        getDiffDuration(
            epochToMoment(portfolio_pos.purchase_time || portfolio_pos.date_start),
            epochToMoment(portfolio_pos.expiry_time)
        );
    const duration = portfolio_pos.tick_count ?
        portfolio_pos.tick_count
        :
        getDurationUnitValue(duration_diff);
    const purchase = parseFloat(portfolio_pos.buy_price);
    const payout   = parseFloat(portfolio_pos.payout);

    return {
        duration,
        duration_unit: getDurationUnitText(duration_diff),
        reference    : +portfolio_pos.transaction_id,
        type         : portfolio_pos.contract_type,
        details      : portfolio_pos.longcode.replace(/\n/g, '<br />'),
        payout,
        purchase,
        expiry_time  : portfolio_pos.expiry_time,
        id           : portfolio_pos.contract_id,
        indicative   : 0,
    };
};
