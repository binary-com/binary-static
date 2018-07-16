// TODO: move rendercells to components
import React from 'react';
import { contract_type_display } from '../../../Constants/contract';
import { localize }              from '../../../../_common/localize';
import Money                     from '../../../App/Components/Elements/money.jsx';

export const getTableColumnsTemplate = (currency) => [
    {
        title     : localize('Reference No.'),
        col_index: 'reference',
    },
    {
        title     : localize('Contract Type'),
        col_index: 'type',
        renderCellContent: (cell_value, col_index, portfolio_position, is_footer) => {
            if (is_footer) return '';

            return (
                <div className='type-container'>
                    <i className={`trade-type-icon icon_${cell_value.toLowerCase()}--light`} />
                    {localize(contract_type_display[cell_value])}
                </div>
            );
        },
    },
    {
        title     : localize('Contract Details'),
        col_index: 'details',
    },
    {
        title     : localize('Remaining Time (GMT)'),
        col_index: 'remaining_time',
    },
    {
        title     : localize('Potential Payout'),
        col_index: 'payout',
        renderCellContent: (cell_value) => (
            <Money amount={cell_value} currency={currency} />
        ),
    },
    {
        title     : localize('Purchase'),
        col_index: 'purchase',
        renderCellContent: (cell_value) => (
            <Money amount={cell_value} currency={currency} />
        ),
    },
    {
        title     : localize('Indicative'),
        col_index: 'indicative',
        renderCellContent: (cell_value, col_index, portfolio_position, is_footer) => {
            const modifier_class_name = portfolio_position.status
                ? `indicative--${portfolio_position.status}`
                : '';
            return (
                <div className={modifier_class_name}>
                    <Money amount={cell_value} currency={currency} />

                    {portfolio_position.status === 'no-resale' &&
                        <div className='indicative__no-resale-msg'>
                            {localize('Resale not offered')}
                        </div>
                    }
                </div>
            );
        },
    },
];