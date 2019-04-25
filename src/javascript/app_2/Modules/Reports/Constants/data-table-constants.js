import React                from 'react';
import { localize }         from '_common/localize';
import Label                from 'App/Components/Elements/Label';
import Money                from 'App/Components/Elements/money.jsx';
import ProgressSliderStream from 'App/Containers/ProgressSliderStream';
import ContractTypeCell     from 'Modules/Portfolio/Components/contract-type-cell.jsx';
import IndicativeCell       from 'Modules/Portfolio/Components/indicative-cell.jsx';
import AmountCell           from '../Components/amount-cell.jsx';
import MarketSymbolIconRow  from '../Components/market-symbol-icon-row.jsx';
import ProfitLossCell       from '../Components/profit_loss_cell.jsx';

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
export const getStatementTableColumnsTemplate = () => [
    {
        key              : 'icon',
        title            : '',
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj }) => (
            <MarketSymbolIconRow
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
export const getProfitTableColumnsTemplate = () => [
    {
        key              : 'icon',
        title            : '',
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj, is_footer }) => {
            if (is_footer) return localize('Total profit/loss');

            return (
                <MarketSymbolIconRow
                    action={cell_value}
                    key={row_obj.transaction_id}
                    payload={row_obj}
                />
            );
        },
    }, {
        title    : localize('Date'),
        col_index: 'purchase_time',
    }, {
        title    : localize('Ref. ID'),
        col_index: 'transaction_id',
    }, {
        title            : localize('Purchase'),
        col_index        : 'buy_price',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return '';

            return <Money amount={cell_value} />;
        },
    }, {
        title    : localize('Sale Date'),
        col_index: 'sell_time',
    }, {
        title            : localize('Sale Price'),
        col_index        : 'sell_price',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return '';

            return <Money amount={cell_value} />;
        },
    }, {
        title            : localize('Profit/Loss'),
        col_index        : 'profit_loss',
        renderCellContent: ({ cell_value }) => (
            <ProfitLossCell value={cell_value}>
                <Money amount={cell_value} />
            </ProfitLossCell>
        ),
    },
];
export const getOpenPositionsColumnsTemplate = (currency) => [
    {
        title            : '',
        col_index        : 'type',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return localize('Total');

            return <ContractTypeCell type={cell_value} />;
        },
    }, {
        title    : localize('Ref. ID'),
        col_index: 'reference',
    }, {
        title            : localize('Potential Payout'),
        col_index        : 'payout',
        renderCellContent: ({ cell_value }) => (
            <Money amount={cell_value} currency={currency} />
        ),
    }, {
        title            : localize('Purchase'),
        col_index        : 'purchase',
        renderCellContent: ({ cell_value }) => (
            <Money amount={cell_value} currency={currency} />
        ),
    }, {
        title            : localize('Indicative'),
        col_index        : 'indicative',
        renderCellContent: ({ cell_value, row_obj }) => (
            <IndicativeCell amount={+cell_value} currency={currency} status={row_obj.status} />
        ),
    }, {
        title            : localize('Remaining Time'),
        col_index        : 'id',
        renderCellContent: ({ cell_value }) => (
            <ProgressSliderStream id={cell_value} />
        ),
    },
];
/* eslint-enable react/display-name, react/prop-types */
