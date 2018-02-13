import DAO from '../data/dao';
import { isCryptocurrency } from '../../../../app/common/currency';
import { localize } from '../../../../_common/localize';

export const getCurrenciesAsync = function* (store) {
    const r = yield DAO.getPayoutCurrencies();
    const fiat   = [];
    const crypto = [];

    r.payout_currencies.forEach((currency) => {
        (isCryptocurrency(currency) ? crypto : fiat).push({ text: currency, value: currency });
    });

    const fields = {
        currencies_list: {
            [localize('Fiat Currency')] : fiat,
            [localize('Cryptocurrency')]: crypto,
        },
    };

    if (!store.currency) {
        fields.currency = Object.values(fields.currencies_list).reduce((a, b) => [...a, ...b]).find(c => c).value;
    }

    return fields;
};
