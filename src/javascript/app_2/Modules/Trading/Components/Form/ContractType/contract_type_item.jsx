import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { IconTradeCategory }          from 'Assets/Trading/Categories';
import { IconExclamation }            from 'Assets/Common/icon_exclamation.jsx';

const ContractTypeItem = ({
    contracts,
    name,
    value,
    handleInfoClick,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        (contract.value !== 'rise_fall_equal') &&
        <div
            key={idx}
            className={`list-item ${value === contract.value ? 'selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={(e) => handleSelect(contract, e)}
        >
            <IconTradeCategory category={contract.value} />
            <span className='contract-title'>
                {contract.text}
            </span>
            <div id='info-icon' className='trade-type-info-icon' onClick={() => handleInfoClick(contract)}>
                <IconExclamation />
            </div>
        </div>
    ))
);

ContractTypeItem.propTypes = {
    contracts      : MobxPropTypes.arrayOrObservableArray,
    handleInfoClick: PropTypes.func,
    handleSelect   : PropTypes.func,
    name           : PropTypes.string,
    value          : PropTypes.string,
};

export default ContractTypeItem;
