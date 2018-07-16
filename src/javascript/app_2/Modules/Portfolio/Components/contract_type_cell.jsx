import React from 'react';
import { contract_type_display } from '../../../Constants/contract';
import { localize }              from '../../../../_common/localize';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <i className={`contract-type__icon icon_${type.toLowerCase()}--light`} />
        {localize(contract_type_display[type])}
    </div>
);

export default ContractTypeCell;