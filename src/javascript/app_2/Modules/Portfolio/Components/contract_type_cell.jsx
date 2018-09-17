import React                     from 'react';
import PropTypes                 from 'prop-types';
import { localize }              from '_common/localize';
import { contract_type_display } from 'Constants/contract';
import { IconTradeType }         from 'Assets/Trading/Types';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <div className='type-wrapper'>
            <IconTradeType type={type.toLowerCase()} className='type' />
        </div>
        <span>
            {localize(contract_type_display[type] || '')}
        </span>
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;
