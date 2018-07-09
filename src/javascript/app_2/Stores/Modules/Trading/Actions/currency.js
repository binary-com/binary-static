import {
    buildCurrenciesList,
    getDefaultCurrency } from '../Helpers/currency';
import { WS }            from '../../../../Services';

export const getCurrenciesAsync = async(currency) => {
    const response = await WS.payoutCurrencies();

    const currencies_list  = buildCurrenciesList(response.payout_currencies);
    const default_currency = getDefaultCurrency(currencies_list, currency);

    return {
        currencies_list,
        ...(default_currency),
    };
};
