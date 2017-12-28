import React from 'react';

const TableRow = ({ header, text_1, text_2, text_3 }) => (
    <div className={`gr-row gr-padding-10 ${header ? 'table-header' : 'table-body table-body-lines'}`}>
        <div className='gr-2 center-text'>{text_1}</div>
        <div className='gr-6'>{text_2}</div>
        <div className='gr-4'>{text_3}</div>
    </div>
);

const CommissionTable = () => (
    <div className='gr-parent gr-6 gr-12-m gr-centered'>
        <TableRow header='1' text_1={it.L('Tier')} text_2={it.L('Total Net Revenue Per Month')} text_3={it.L('Commission Rates')} />
        <TableRow            text_1='1'            text_2='0 - $10,000'                         text_3='20 %' />
        <TableRow            text_1='2'            text_2='$10,001 - $50,000'                   text_3='25 %' />
        <TableRow            text_1='3'            text_2='$50,001 - $100,000'                  text_3='30 %' />
        <TableRow            text_1='4'            text_2='$100,001 +'                          text_3='35 %' />
    </div>
);

export default CommissionTable;
