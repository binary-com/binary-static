
import ContractType from 'Stores/Modules/Trading/Helpers/contract_type';

export const getTradingEvents = async (date, underlying) => {
    const trading_events = await ContractType.getTradingTimes(date, underlying, true);
    return trading_events || [];
};
