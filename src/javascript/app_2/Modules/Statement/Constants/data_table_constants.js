import React                          from 'react';
import Amount                         from '../Components/amount.jsx';
import { localize }                   from '../../../../_common/localize';

export const getTableColumnsTemplate = () => 
    [
        { title: localize('Date'),          data_index: 'date' },
        { title: localize('Ref.'),             data_index: 'refid' },
        { title: localize('Description'),      data_index: 'desc' },
        { title: localize('Action'),           data_index: 'action' },
        { title: localize('Potential Payout'), data_index: 'payout' },
        { title: localize('Credit/Debit'),     data_index: 'amount', renderCellContent: (content) => <Amount content={content} /> },
        { title: localize('Balance'),          data_index: 'balance' },
    ];
