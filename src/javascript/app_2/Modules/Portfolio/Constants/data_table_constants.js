// TODO: move rendercells to componentns
import React from 'react';
import { contract_type_display } from '../../../Constants/contract';
import { localize }              from '../../../../_common/localize';

export const getTableColumnsTemplate = (currency) => [
    {
        title     : localize('Reference No.'),
        data_index: 'reference',
        renderCell: (data, data_index) => (
            <td key={data_index} className={data_index}>
                {data.transaction_id || ''}
            </td>
        ),
    },
    {
        title     : localize('Contract Type'),
        data_index: 'type',
        renderCell: (data, data_index) => {
            if (data) {
                return (
                    <td key={data_index}>
                        <div className={`${data_index}_container`}>
                            <i className={`trade_type_icon icon_${data.toLowerCase()}--light`} />
                            {localize(contract_type_display[data])}
                        </div>
                    </td>);
            }
            return ( <td key={data_index} />);
        },
    },
    {
        title     : localize('Contract Details'),
        data_index: 'details',
    },
    {
        title     : localize('Remaining Time (GMT)'),
        data_index: 'remaining_time',
    },
    {
        title     : localize('Potential Payout'),
        data_index: 'payout',
        renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${currency}`}/>{data}</td>),
    },
    {
        title     : localize('Purchase'),
        data_index: 'purchase',
        renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${currency}`}/>{data}</td>),
    },
    {
        title     : localize('Indicative'),
        data_index: 'indicative',
        renderCell: (data, data_index) => {
            if (data.amount) {
                return (
                    <td key={data_index} className={`indicative ${data.style}`}>
                        <span className={`symbols ${currency}`}/>{data.amount}
                        {data.style === 'no_resale' && <div> {localize('resell not offered')}</div>}
                    </td>);
            }
            // Footer total:
            if (data && typeof data === 'string') {
                return <td key={data_index} className={data_index}> <span className={`symbols ${currency}`}/>{data}</td>;
            }
            return <td key={data_index}>-</td>;
        },
    },
];