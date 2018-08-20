import React                     from 'react';
import Money                     from '../../../../App/Components/Elements/money.jsx';
import { contract_type_display } from '../../../../Constants/contract';
import { toGMTFormat }           from '../../../../Utils/Date';
import { addComma }              from '../../../../../_common/base/currency_base';
import { localize }              from '../../../../../_common/localize';

export const getDetailsInfo = (contract_info) => {
    const {
        contract_type,
        date_start,
        sell_time,
        entry_spot,
    } = contract_info;

    // if a forward starting contract was sold before starting
    // API will still send entry spot when start time is passed
    // we will hide it from our side
    const is_sold_before_start = sell_time && +sell_time < +date_start;
    const txt_start_time       = date_start && toGMTFormat(+date_start * 1000);
    const txt_entry_spot       = entry_spot && !is_sold_before_start ? addComma(entry_spot) : '-';

    // TODO: don't localize on every call
    return {
        [localize('Contract Type')]: contract_type_display[contract_type],
        [localize('Start Time')]   : txt_start_time,
        [localize('Entry Spot')]   : txt_entry_spot,
    };
};

export const getDetailsExpiry = (store) => {
    if (!store.is_ended) return {};

    const {
        contract_info,
        end_spot,
        end_spot_time,
        indicative_price,
        is_user_sold,
    } = store;

    // TODO: don't localize on every call
    // for user sold contracts sell spot can get updated when the next tick becomes available
    // so we only show end time instead of any spot information
    return {
        ...(is_user_sold ? {
            [localize('End Time')]: contract_info.date_expiry && toGMTFormat(+contract_info.date_expiry * 1000),
        } : {
            [localize('Exit Spot')]     : end_spot ? addComma(end_spot) : '-',
            [localize('Exit Spot Time')]: end_spot_time ? toGMTFormat(+end_spot_time * 1000) : '-',
        }),
        [localize('Payout')]: <Money amount={indicative_price} currency={'USD'} />,
    };
};
