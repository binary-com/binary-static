import React                          from 'react';
import AmountCell                     from '../Components/amount_cell.jsx';
import { localize }                   from '../../../../_common/localize';

/* eslint-disable react/display-name */
export const getTableColumnsTemplate = () => 
    [
        { title: localize('Date'),             col_index: 'date'    },
        { title: localize('Ref.'),             col_index: 'refid'   },
        { title: localize('Description'),      col_index: 'desc'    },
        { title: localize('Action'),           col_index: 'action'  },
        { title: localize('Potential Payout'), col_index: 'payout'  },
        { title: localize('Credit/Debit'),     col_index: 'amount', renderCellContent: ({ cell_value }) => <AmountCell value={cell_value} /> },
        { title: localize('Balance'),          col_index: 'balance' },
    ];
/* eslint-enable react/display-name */
