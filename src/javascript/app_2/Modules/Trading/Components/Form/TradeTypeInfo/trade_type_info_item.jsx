import PropTypes                    from 'prop-types';
import React                        from 'react';
import { ComponentTradeCategories } from 'Assets/Trading/Categories/components_trade_categories.jsx';
import { IconBack }                 from 'Assets/Common/icon_back.jsx';
import Button                       from 'App/Components/Form/button.jsx';
import { localize }                 from '_common/localize';

const ContractTypeItem = ({
    handleNextClick,
    handlePaginationClick,
    handlePrevClick,
    is_mobile,
    item,
    onBackButtonClick,
    onSubmitButtonClick,
    paginationList,
}) => (
    <React.Fragment>
        {!is_mobile &&
        <div className='info-header'>
            <span onClick={() => onBackButtonClick()}>
                <IconBack />
            </span>
            <span className='title'>{item.text}</span>
        </div>
        }
        <div className='info-gif'>
            gif explanation
        </div>
        <div className='info-content'>
            <ComponentTradeCategories category={item.value} />
        </div>
        <Button className='info-choose' text={localize('CHOOSE')} onClick={() => onSubmitButtonClick(item)} />
        <div className='info-pagination-container'>
            <span className='prev' onClick={() => handlePrevClick(paginationList)} />
            <div className='info-pagination'>
                {
                    paginationList.map((contract, idx) => (
                        <React.Fragment key={idx}>
                            <div
                                className={`circle-button ${contract.value === item.value ? 'active' : ''}`}
                                onClick={() => handlePaginationClick(contract)}
                            />
                        </React.Fragment>
                    ))
                }
            </div>
            <span className='next' onClick={() => handleNextClick(paginationList)} />
        </div>
    </React.Fragment>
);

ContractTypeItem.propTypes = {
    handleNextClick      : PropTypes.func,
    handlePaginationClick: PropTypes.func,
    handlePrevClick      : PropTypes.func,
    is_mobile            : PropTypes.bool,
    item                 : PropTypes.object,
    onBackButtonClick    : PropTypes.func,
    onSubmitButtonClick  : PropTypes.func,
    paginationList       : PropTypes.array,
};

export default ContractTypeItem;
