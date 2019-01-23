import PropTypes                    from 'prop-types';
import React                        from 'react';
import { ComponentTradeCategories } from 'Assets/Trading/Categories/components_trade_categories.jsx';
import { IconBack }                 from 'Assets/Common/icon_back.jsx';
import Button                       from 'App/Components/Form/button.jsx';
import { localize }                 from '_common/localize';

const ContractTypeItem = ({
    item,
    onBackButtonClick,
    onSubmitButtonClick,
}) => (
    <React.Fragment>
        <div className='info-header'>
            <span onClick={() => onBackButtonClick()}>
                <IconBack />
            </span>
            <span className='title'>{item.text}</span>
        </div>
        <div className='info-gif'>
            gif explanation
        </div>
        <div className='info-content'>
            <ComponentTradeCategories category={item.value} />
        </div>
        <Button text={localize('CHOOSE')} className='info-choose' onClick={() => onSubmitButtonClick(item)} />
    </React.Fragment>
);

ContractTypeItem.propTypes = {
    item               : PropTypes.object,
    onBackButtonClick  : PropTypes.func,
    onSubmitButtonClick: PropTypes.func,
};

export default ContractTypeItem;
