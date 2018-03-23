import DAO from '../data/dao';
import { isCryptocurrency } from '../../../../app/common/currency';
import { localize } from '../../../../_common/localize';

export const getCurrenciesAsync = function* ({ currency }) {
    const r = yield DAO.getPayoutCurrencies();
    const fiat   = [];
    const crypto = [];

    r.payout_currencies.forEach((cur) => {
        (isCryptocurrency(cur) ? crypto : fiat).push({ text: cur, value: cur });
    });

    const fields = {
        currencies_list: {
            [localize('Fiat Currency')] : fiat,
            [localize('Cryptocurrency')]: crypto,
        },
    };

    if (!currency) {
        fields.currency = Object.values(fields.currencies_list).reduce((a, b) => [...a, ...b]).find(c => c).value;
    }

    return fields;
};
