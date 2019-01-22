import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { IconTradeCategory }          from 'Assets/Trading/Categories';
import Tooltip                        from 'App/Components/Elements/tooltip.jsx';

const ContractTypeItem = ({
    contracts,
    name,
    value,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        (contract.value !== 'rise_fall_equal') &&
        <div
            key={idx}
            className={`list-item ${value === contract.value ? 'selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={() => handleSelect(contract)}
        >
            <IconTradeCategory category={contract.value} />
            <span className='contract-title'>
                {contract.text}
            </span>
            <Tooltip
                alignment='left'
                icon='info'
            />
        </div>
    ))
);

ContractTypeItem.propTypes = {
    contracts   : MobxPropTypes.arrayOrObservableArray,
    handleSelect: PropTypes.func,
    name        : PropTypes.string,
    value       : PropTypes.string,
};

export default ContractTypeItem;
