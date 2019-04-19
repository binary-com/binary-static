import React            from 'react';
import { localize }     from '_common/localize';
import Label            from 'App/Components/Elements/Label';
import AmountCell       from '../Components/amount-cell.jsx';
import StatementRowIcon from '../Components/statement-row-icon.jsx';

const getModeFromValue = (key) => {
    const map = {
        deposit: 'warn',
        sell   : 'danger',
        buy    : 'success',
        default: 'default',
    };

    if (Object.keys(map).find(x => x === key)) {
        return map[key];
    }

    return map.default;
};
/* eslint-disable react/display-name, react/prop-types */
export const getTableColumnsTemplate = () => [
    {
        key              : 'icon',
        title            : '',
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj }) => (
            <StatementRowIcon
                action={cell_value}
                key={row_obj.transaction_id}
                payload={row_obj}
            />
        ),
    }, {
        title    : localize('Date'),
        col_index: 'date',
    }, {
        title    : localize('Ref. ID'),
        col_index: 'refid',
    }, {
        key              : 'mode',
        title            : localize('Action'),
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj }) => (
            <Label mode={getModeFromValue(cell_value)}>{row_obj.action}</Label>
        ),
    }, {
        title            : localize('Credit/Debit'),
        col_index        : 'amount',
        renderCellContent: ({ cell_value }) => <AmountCell value={cell_value} />,
    }, {
        title    : localize('Balance'),
        col_index: 'balance',
    },
];
/* eslint-enable react/display-name, react/prop-types */
