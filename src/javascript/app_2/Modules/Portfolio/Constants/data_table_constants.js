// TODO: move rendercells to components
import React from 'react';
import { contract_type_display } from '../../../Constants/contract';
import { localize }              from '../../../../_common/localize';

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
        // renderCell: (data, col_index) => (<td key={col_index} className={col_index}> <span className={`symbols ${currency}`}/>{data}</td>),
    },
    {
        title     : localize('Purchase'),
        col_index: 'purchase',
        // renderCell: (data, col_index) => (<td key={col_index} className={col_index}> <span className={`symbols ${currency}`}/>{data}</td>),
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
                    <div className='indicative__value'>
                        <span className={`symbols ${currency}`} />
                        {cell_value}
                    </div>

                    {portfolio_position.status === 'no-resale' &&
                        <div className='indicative__message'>
                            {localize('Resale not offered')}
                        </div>
                    }
                </div>
            );
        },
    },
];