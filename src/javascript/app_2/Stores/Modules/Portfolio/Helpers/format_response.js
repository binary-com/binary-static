import { toMoment }    from '../../../../Utils/Date';
import { localize }    from '../../../../../_common/localize';

export const formatPortfolioResponse = (portfolio_arr) => (
    portfolio_arr.map((portfolio_item) => {
        const moment_obj     = toMoment(portfolio_item.expiry_time);
        // TODO: fromNow should check against server time not local time
        const remaining_time = `${moment_obj.fromNow(true)} - ${moment_obj.format('h:mm:ss')}`;
        const purchase       = parseFloat(portfolio_item.buy_price);
        const payout         = parseFloat(portfolio_item.payout);

        return {
            reference : portfolio_item.transaction_id,
            type      : portfolio_item.contract_type,
            details   : localize(portfolio_item.longcode.replace(/\n/g, '<br />')),
            payout,
            purchase,
            remaining_time,
            id        : portfolio_item.contract_id,
            indicative: '',
        };
    })
);
