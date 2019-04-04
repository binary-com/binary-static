import classNames                  from 'classnames';
import React                       from 'react';
import { localize }                from '_common/localize';
import { PopConfirm }              from 'App/Components/Elements/PopConfirm';
import Tooltip                     from 'App/Components/Elements/tooltip.jsx';
import Fieldset                    from 'App/Components/Form/fieldset.jsx';
import ContractInfo                from 'Modules/Trading/Components/Form/Purchase/contract-info.jsx';
import PurchaseLock                from 'Modules/Trading/Components/Form/Purchase/PurchaseLock';
import PurchaseButton              from 'Modules/Trading/Components/Elements/purchase-button.jsx';

const PurchaseFieldset = ({
    basis,
    currency,
    info,
    idx,
    is_contract_mode,
    is_disabled,
    is_high_low,
    is_loading,
    is_purchase_confirm_on,
    is_proposal_error,
    is_purchase_locked,
    togglePurchaseLock,
    onClickPurchase,
    onHoverPurchase,
    type,
}) => {
    const purchase_button = (
        <PurchaseButton
            currency={currency}
            info={info}
            is_contract_mode={is_contract_mode}
            is_disabled={is_disabled}
            is_high_low={is_high_low}
            is_loading={is_loading}
            onClickPurchase={onClickPurchase}
            type={type}
        />
    );
    return (
        <Fieldset
            className='trade-container__fieldset purchase-container__option'
            key={idx}
        >
            {(is_purchase_locked && idx === 0) &&
            <PurchaseLock onClick={togglePurchaseLock} />
            }
            <React.Fragment>
                <ContractInfo
                    basis={basis}
                    currency={currency}
                    proposal_info={info}
                    has_increased={info.has_increased}
                    is_loading={is_loading}
                    is_visible={!is_contract_mode}
                />
                <div
                    className={classNames('btn-purchase__shadow-wrapper', { 'btn-purchase__shadow-wrapper--disabled': (is_proposal_error || is_disabled) })}
                    onMouseEnter={() => { onHoverPurchase(true, type); }}
                    onMouseLeave={() => { onHoverPurchase(false); }}
                >
                    {is_proposal_error &&
                    <Tooltip message={info.message} alignment='left' className='tooltip--error-secondary' />
                    }
                    {
                        is_purchase_confirm_on ?
                            <PopConfirm
                                alignment='left'
                                cancel_text={localize('Cancel')}
                                confirm_text={localize('Purchase')}
                                message={localize('Are you sure you want to purchase this contract?')}
                            >
                                {purchase_button}
                            </PopConfirm>
                            :
                            purchase_button
                    }
                </div>
            </React.Fragment>
        </Fieldset>
    );
};

export default PurchaseFieldset;
