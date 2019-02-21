import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { IconTooltip }                from 'Assets/Common/icon-tooltip.jsx';
import { IconTradeCategory }          from 'Assets/Trading/Categories';

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
            className={`contract-type-item ${value === contract.value ? 'contract-type-item--selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={(e) => handleSelect(contract, e)}
        >
            <IconTradeCategory category={contract.value} className='contract-type-item__icon-wrapper' />
            <span className='contract-type-item__title'>
                {contract.text}
            </span>
            <div id='info-icon' className='contract-type-item__icon' onClick={() => handleInfoClick(contract)}>
                <IconTooltip />
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
