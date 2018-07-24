import React                     from 'react';
import Money                     from '../../../../App/Components/Elements/money.jsx';
import { contract_type_display } from '../../../../Constants/contract';
import { toGMTFormat }           from '../../../../Utils/Date';
import { addComma }              from '../../../../../_common/base/currency_base';
import { localize }              from '../../../../../_common/localize';

export const getDetailsInfo = (contract_info) => {
    const {
        contract_id,
        contract_type,
        date_expiry,
        date_start,
        entry_spot,
    } = contract_info;

    // TODO: don't localize on every call
    return {
        [localize('Contract ID')]  : contract_id,
        [localize('Contract Type')]: contract_type_display[contract_type],
        [localize('Start Time')]   : date_start  && toGMTFormat(date_start  * 1000),
        [localize('End Time')]     : date_expiry && toGMTFormat(date_expiry * 1000),
        [localize('Entry Spot')]   : addComma(entry_spot),
    };
};

export const getDetailsExpiry = (store) => {
    if (!store.is_ended) return {};

    const {
        exit_tick,
        exit_tick_time,
    } = store.contract_info;

    // TODO: don't localize on every call
    return {
        [localize('Exit Spot')]     : addComma(exit_tick),
        [localize('Exit Spot Time')]: exit_tick_time && toGMTFormat(exit_tick_time * 1000),
        [localize('Price')]         : <Money amount={store.indicative_price} currency={'USD'} />,
    };
};
