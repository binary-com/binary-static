import PropTypes                    from 'prop-types';
import React                        from 'react';
import { ComponentTradeCategories } from 'Assets/Trading/Categories/components_trade_categories.jsx';
import { IconBack }                 from 'Assets/Common/icon_back.jsx';
import Button                       from 'App/Components/Form/button.jsx';
import { localize }                 from '_common/localize';

const ContractTypeItem = ({
    list,
    item,
    onBackButtonClick,
    onSubmitButtonClick,
    handleNextClick,
    handlePaginationClick,
    handlePrevClick,
}) => {
    const paginationList = [];
    const getPaginationList = () => {
        Object.keys(list).map((key, index) => {
            !['In/Out', 'Asians'].includes(key) &&
                list[key].map((contract, idx) => {
                    (contract.value !== 'rise_fall_equal') && paginationList.push(contract);
                });
            }
        );
        return getPaginationList;
    };
    getPaginationList();

    return (
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
        <div onClick={() => handlePrevClick(paginationList)}>
            prev
        </div>
        <div className='info-pagination'>
            {
                paginationList.map((contract, idx) => (
                    <React.Fragment key={idx}>
                        <div onClick={() => handlePaginationClick(contract)}
                             className='circle-button'/>
                    </React.Fragment>
                ))
            }

        </div>
        <div onClick={() => handleNextClick(paginationList)}>
            next
        </div>

    </React.Fragment>
)};

ContractTypeItem.propTypes = {
    list                 : PropTypes.object,
    item                 : PropTypes.object,
    onBackButtonClick    : PropTypes.func,
    onSubmitButtonClick  : PropTypes.func,
    handleNextClick      : PropTypes.func,
    handlePaginationClick: PropTypes.func,
    handlePrevClick      : PropTypes.func,
};

export default ContractTypeItem;
