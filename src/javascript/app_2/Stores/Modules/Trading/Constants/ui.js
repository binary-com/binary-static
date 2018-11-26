import Amount    from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
import Barrier   from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import Duration  from 'Modules/Trading/Components/Form/TradeParams/duration.jsx';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last_digit.jsx';
import StartDate from 'Modules/Trading/Components/Form/TradeParams/start_date.jsx';

export const form_components = [
    { name: 'start_date', Component: StartDate },
    { name: 'duration',   Component: Duration },
    { name: 'barrier',    Component: Barrier },
    { name: 'last_digit', Component: LastDigit },
    { name: 'amount',     Component: Amount },
];
