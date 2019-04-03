import classNames                 from 'classnames';
import React                      from 'react';
import { localize }               from '_common/localize';
import Money                      from 'App/Components/Elements/money.jsx';
import Button                     from 'App/Components/Form/button.jsx';
import { IconTradeType }          from 'Assets/Trading/Types';
import { getContractTypeDisplay } from 'Constants/contract';

const PurchaseButton = ({
    currency,
    info,
    is_contract_mode,
    is_disabled,
    is_high_low,
    is_loading,
    onClickPurchase,
    type,
}) => {
    /*
        TODO:
        We should remove the string overriding when API sends the correct strings.
    */
    const contract_type_display = getContractTypeDisplay();
    if (is_high_low) {
        contract_type_display[type] = /CALL/.test(type) ? 'Higher' : 'Lower';
    }
    return (
        <Button
            is_disabled={ is_contract_mode || is_disabled }
            id={`purchase_${type}`}
            className={classNames(
                'btn-purchase',
                { 'btn-purchase--disabled': (is_contract_mode || is_disabled) && !is_loading },
                { 'btn-purchase--animated': is_loading })}
            has_effect
            onClick={() => { onClickPurchase(info.id, info.stake, type); }}
        >
            <React.Fragment>
                <div className='btn-purchase__trade-type'>
                    <div className='btn-purchase__icon_wrapper'>
                        <IconTradeType
                            className='btn-purchase__icon'
                            type={is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                        />
                    </div>
                    <div className='btn-purchase__text_wrapper'>
                        <span className='btn-purchase__text'>{localize('[_1]', contract_type_display[type])}</span>
                    </div>
                </div>
                <div className='btn-purchase__effect-detail' />
                <div className='btn-purchase__info'>
                    <div className='btn-purchase__return'>
                        <div className='btn-purchase__text_wrapper'>
                            <span className='btn-purchase__text'>{is_disabled ? '' : info.returns}</span>
                        </div>
                    </div>
                    <div className='btn-purchase__profit'>
                        <div className='btn-purchase__text_wrapper'>
                            <span className='btn-purchase__text'>{is_disabled ? '' : <Money amount={info.profit} currency={currency} className='btn-purchase__currency' />}</span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Button>
    );
};

export default PurchaseButton;
