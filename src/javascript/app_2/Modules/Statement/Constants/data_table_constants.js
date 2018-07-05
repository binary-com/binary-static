import AmountCell                     from '../Components/amount_cell.jsx';
import { localize }                   from '../../../../_common/localize';

export const getTableColumnsTemplate = () => 
    [
        { title: localize('Date'),          data_index: 'date' },
        { title: localize('Ref.'),             data_index: 'refid' },
        { title: localize('Description'),      data_index: 'desc' },
        { title: localize('Action'),           data_index: 'action' },
        { title: localize('Potential Payout'), data_index: 'payout' },
        // TODO: Passing component references as props like "AmountCell" here is a bad practice.
        // use Children or a render callback instead.
        { title: localize('Credit/Debit'),     data_index: 'amount', renderCell: AmountCell },
        { title: localize('Balance'),          data_index: 'balance' },
    ];
