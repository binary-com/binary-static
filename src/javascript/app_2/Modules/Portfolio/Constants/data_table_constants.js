// TODO: move rendercells to componentns
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
        // renderCell: (data, col_index) => {
        //     if (data) {
        //         return (
        //             <div className={`${col_index}_container`}>
        //                 <i className={`trade_type_icon icon_${data.toLowerCase()}--light`} />
        //                 {localize(contract_type_display[data])}
        //             </div>
        //         );
        //     }
        //     return ( <td key={col_index} />);
        // },
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
                            {localize('resell not offered')}
                        </div>
                    }
                </div>
            );
            // if (data.amount) {
            //     return (
            //         <td key={col_index} className={`indicative ${data.style}`}>
            //             <span className={`symbols ${currency}`}/>{data.amount}
            //             {data.style === 'no_resale' && <div> {localize('resell not offered')}</div>}
            //         </td>);
            // }
            // // Footer total:
            // if (data && typeof data === 'string') {
            //     return <td key={col_index} className={col_index}> </td>;
            // }
            // return <td key={col_index}>-</td>;
        },
    },
];