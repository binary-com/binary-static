import Amount    from 'Modules/Trading/Components/Form/TradeParams/amount';
import Barrier   from 'Modules/Trading/Components/Form/TradeParams/barrier';
import Duration  from 'Modules/Trading/Components/Form/TradeParams/duration';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last_digit';
import StartDate from 'Modules/Trading/Components/Form/TradeParams/start_date';

export const form_components = [
    { name: 'start_date', Component: StartDate },
    { name: 'duration',   Component: Duration },
    { name: 'barrier',    Component: Barrier },
    { name: 'last_digit', Component: LastDigit },
    { name: 'amount',     Component: Amount },
];
