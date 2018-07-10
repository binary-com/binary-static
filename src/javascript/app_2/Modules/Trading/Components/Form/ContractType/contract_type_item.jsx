import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

const ContractTypeItem = ({
    contracts,
    name,
    value,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        <div
            key={idx}
            className={`list-item ${value === contract.value ? 'selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={() => handleSelect(contract)}
        >
            <i className={`contract-icon ic-${contract.value}${value === contract.value ? '' : '--invert'}`} />
            <span className='contract-title'>
                {contract.text}
            </span>
        </div>
    ))
);

ContractTypeItem.propTypes = {
    contracts   : MobxPropTypes.arrayOrObservableArray,
    name        : PropTypes.string,
    value       : PropTypes.string,
    handleSelect: PropTypes.func,
};

export default ContractTypeItem;
