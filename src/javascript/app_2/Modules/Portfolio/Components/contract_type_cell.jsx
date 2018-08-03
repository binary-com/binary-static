import React                     from 'react';
import PropTypes                 from 'prop-types';
import { contract_type_display } from '../../../Constants/contract';
import { IconTradeType }         from '../../../Assets/Trading/Types';
import { localize }              from '../../../../_common/localize';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <div className='type-wrapper'>
            <IconTradeType type={type.toLowerCase()} className='type' />
        </div>
        {localize(contract_type_display[type] || '')}
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;
