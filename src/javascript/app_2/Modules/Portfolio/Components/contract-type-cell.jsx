import React                      from 'react';
import PropTypes                  from 'prop-types';
import { getContractTypeDisplay } from 'Constants/contract';
import { IconTradeType }          from 'Assets/Trading/Types';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <div className='type-wrapper'>
            <IconTradeType type={type.toLowerCase()} className='type' />
        </div>
        <span>
            {getContractTypeDisplay(type) || ''}
        </span>
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;
