import WS                   from '../../../data/ws_methods';
import { isCryptocurrency } from '../../../../_common/base/currency_base';
import { localize }         from '../../../../_common/localize';

export const getCurrenciesAsync = async(currency) => {
    const r = await WS.payoutCurrencies();
    const fiat   = [];
    const crypto = [];

    r.payout_currencies.forEach((cur) => {
        (isCryptocurrency(cur) ? crypto : fiat).push({ text: cur, value: cur });
    });

    const currencies_list = {
        [localize('Fiat')]  : fiat,
        [localize('Crypto')]: crypto,
    };

    return {
        currencies_list,
        ...(!currency &&
            { currency: Object.values(currencies_list).reduce((a, b) => [...a, ...b]).find(c => c).value }
        ),
    };
};
