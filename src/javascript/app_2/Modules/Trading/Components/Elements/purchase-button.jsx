import classNames        from 'classnames';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Button            from 'App/Components/Form/button.jsx';
import { IconTradeType } from 'Assets/Trading/Types';

const PurchaseButton = ({
    currency,
    info,
    is_disabled,
    is_high_low,
    is_loading,
    onClickPurchase,
    trade_types,
    type,
}) => (
    <Button
        is_disabled={ is_disabled }
        id={`purchase_${type}`}
        className={classNames(
            'btn--primary',
            'btn-purchase',
            { 'animate': is_loading })}
        has_effect
        onClick={() => { onClickPurchase(info.id, info.stake, type); }}
    >
        <React.Fragment>
            <div className='btn-purchase__trade-type'>
                <div className='btn-purchase__icon_wrapper'>
                    <IconTradeType
                        className='btn-purchase__icon'
                        type={!is_disabled ? (!is_high_low ? type.toLowerCase() : `${type.toLowerCase()}_barrier`) : ''}
                    />
                </div>
                <div className='btn-purchase__text_wrapper'>
                    <span className='btn-purchase__text'>{!is_disabled && localize('[_1]', trade_types[type])}</span>
                </div>
            </div>
            <div className='btn-purchase__effect-detail' />
            <div className='btn-purchase__info'>
                <div className='btn-purchase__return'>
                    <div className='btn-purchase__text_wrapper'>
                        <span className='btn-purchase__text'>{!is_disabled && info.returns}</span>
                    </div>
                </div>
                <div className='btn-purchase__profit'>
                    <div className='btn-purchase__text_wrapper'>
                        <span className='btn-purchase__text'>{!is_disabled && <Money amount={info.profit} currency={currency} className='btn-purchase__currency' />}</span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    </Button>
);

export default PurchaseButton;
