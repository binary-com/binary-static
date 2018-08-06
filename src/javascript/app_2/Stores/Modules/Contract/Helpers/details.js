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
        exit_tick,
        exit_tick_time,
        sell_spot,
        sell_spot_time,
        date_expiry,
        is_path_dependent,
        status,
    } = store.contract_info;

    // for path dependent contracts the contract is sold from server side
    // so we need to use sell spot and sell spot time instead
    const end_spot      = is_path_dependent ? sell_spot : exit_tick;
    const end_spot_time = is_path_dependent ? sell_spot_time : exit_tick_time;

    // for user sold contracts sell spot can get updated when the next tick becomes available
    // so we only show end time instead of any spot information
    const is_user_sold = status === 'sold';

    // TODO: don't localize on every call
    return {
        ...(is_user_sold ? {
            [localize('End Time')]: date_expiry && toGMTFormat(+date_expiry * 1000),
        } : {
            [localize('Exit Spot')]     : end_spot ? addComma(end_spot) : '-',
            [localize('Exit Spot Time')]: end_spot_time ? toGMTFormat(+end_spot_time * 1000) : '-',
        }),
        [localize('Payout')]: <Money amount={store.indicative_price} currency={'USD'} />,
    };
};
