import React        from 'react';
import { localize } from '_common/localize';
import Label        from 'App/Components/Elements/Label';
import AmountCell   from '../Components/amount-cell.jsx';

const getModeFromValue = (value) => {
    const map = {
        deposit: 'warn',
        sell   : 'danger',
        buy    : 'success',
        default: 'default',
    };

    const key = value.toLowerCase();
    if (Object.keys(map).find(x => x === key)) {
        return map[key];
    }

    return map.default;
};
/* eslint-disable react/display-name, react/prop-types */
export const getTableColumnsTemplate = () =>
    [
        { title: '',                                col_index: '',       renderCellContent: ({ row_obj }) =>  <div /> },
        { title: localize('Date'),             col_index: 'date'    },
        { title: localize('Ref. ID'),          col_index: 'refid'   },
        { title: localize('Action'),           col_index: 'action', renderCellContent: ({ cell_value }) => <Label mode={getModeFromValue(cell_value)}>{cell_value}</Label>  },
        { title: localize('Credit/Debit'),     col_index: 'amount', renderCellContent: ({ cell_value }) => <AmountCell value={cell_value} /> },
        { title: localize('Balance'),          col_index: 'balance' },
    ];
/* eslint-enable react/display-name, react/prop-types */
