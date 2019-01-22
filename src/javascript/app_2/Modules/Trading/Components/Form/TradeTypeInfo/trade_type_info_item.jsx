import PropTypes                    from 'prop-types';
import React                        from 'react';
import { ComponentTradeCategories } from 'Assets/Trading/Categories/components_trade_categories.jsx';
import { IconBack }                 from 'Assets/Common/icon_back.jsx';

const ContractTypeItem = ({
    item,
    onBackButtonClick,
}) => (
    <React.Fragment>
        <div onClick={() => onBackButtonClick()}>
            <IconBack />
        </div>
        <h1>
            {item.text}
        </h1>
        <div>
            gif explanation
        </div>
        <ComponentTradeCategories category={item.value} />
    </React.Fragment>
);

ContractTypeItem.propTypes = {
    item: PropTypes.object,
    onBackButtonClick: PropTypes.func,
};

export default ContractTypeItem;
