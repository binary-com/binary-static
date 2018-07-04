import React             from 'react';
import DataTable         from '../../../components/elements/data_table.jsx';
import { connect }       from '../../../Stores/connect';
import { localize }      from '../../../../_common/localize';
import AmountCell        from '../Components/amount_cell.jsx';


const CardListDesktop = ({
    data,
    columns
}) => (
    <DataTable
        data_source={data}
        columns={columns}
        has_fixed_header
        is_full_width
    />
);

export default connect(
    ({ modules }) => ({
        data            : modules.statement.data,
        columns         : [
            { title: localize('Daaaate'),          data_index: 'date' },
            { title: localize('Ref.'),             data_index: 'refid' },
            { title: localize('Description'),      data_index: 'desc' },
            { title: localize('Action'),           data_index: 'action' },
            { title: localize('Potential Payout'), data_index: 'payout' },
            // TODO: Passing component references as props like "AmountCell" here is a bad practice.
            // use Children or a render callback instead.
            { title: localize('Credit/Debit'),     data_index: 'amount', renderCell: AmountCell },
            { title: localize('Balance'),          data_index: 'balance' },
        ]
    })
)(CardListDesktop);
