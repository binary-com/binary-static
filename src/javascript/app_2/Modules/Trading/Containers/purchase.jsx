import classNames                  from 'classnames';
import PropTypes                   from 'prop-types';
import React                       from 'react';
import { localize }                from '_common/localize';
import { PopConfirm }              from 'App/Components/Elements/PopConfirm';
import Tooltip                     from 'App/Components/Elements/tooltip.jsx';
import Fieldset                    from 'App/Components/Form/fieldset.jsx';
import { connect }                 from 'Stores/connect';
import { getContractTypePosition } from 'Constants/contract';
import ContractInfo                from '../Components/Form/Purchase/contract-info.jsx';
import PurchaseLock                from '../Components/Form/Purchase/PurchaseLock';
import PurchaseButton              from '../Components/Elements/purchase-button.jsx';

const PurchaseFieldset = ({
    basis,
    currency,
    info,
    idx,
    is_contract_mode,
    is_disabled,
    is_loading,
    is_purchase_confirm_on,
    is_proposal_error,
    is_purchase_locked,
    togglePurchaseLock,
    onHoverPurchase,
    purchase_button,
    type,
}) => (
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

const Purchase = ({
    basis,
    contract_type,
    currency,
    is_contract_mode,
    is_client_allowed_to_visit,
    is_purchase_confirm_on,
    is_purchase_enabled,
    is_purchase_locked,
    is_trade_enabled,
    onClickPurchase,
    onHoverPurchase,
    togglePurchaseLock,
    proposal_info,
    trade_types,
    validation_errors,
}) => {
    const components = [];
    Object.keys(trade_types).map((type, idx) => {
        const info        = proposal_info[type] || {};
        const is_disabled = !is_purchase_enabled
            || !is_trade_enabled
            || !info.id
            || !is_client_allowed_to_visit;
        const is_high_low         = /high_low/.test(contract_type.toLowerCase());
        const is_validation_error = Object.values(validation_errors).some(e => e.length);
        const is_loading          = !is_validation_error && !info.has_error && !info.id;

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

        const is_proposal_error = info.has_error && !info.has_error_details;
        const fieldset = (
            <PurchaseFieldset
                basis={basis}
                currency={currency}
                info={info}
                idx={idx}
                is_contract_mode={is_contract_mode}
                is_disabled={is_disabled}
                is_loading={is_loading}
                is_purchase_confirm_on={is_purchase_confirm_on}
                is_proposal_error={is_proposal_error}
                is_purchase_locked={is_purchase_locked}
                togglePurchaseLock={togglePurchaseLock}
                onHoverPurchase={onHoverPurchase}
                purchase_button={purchase_button}
                type={type}
            />
        );
        const contract_type_position = getContractTypePosition(type);
        if (contract_type_position === 'top'){
            components.unshift(fieldset);
        } else if (contract_type_position === 'bottom') {
            components.push(fieldset);
        }
    });

    return components;
};

Purchase.propTypes = {
    basis                     : PropTypes.string,
    currency                  : PropTypes.string,
    is_client_allowed_to_visit: PropTypes.bool,
    is_contract_mode          : PropTypes.bool,
    is_purchase_confirm_on    : PropTypes.bool,
    is_purchase_enabled       : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    is_trade_enabled          : PropTypes.bool,
    onClickPurchase           : PropTypes.func,
    onHoverPurchase           : PropTypes.func,
    proposal_info             : PropTypes.object,
    purchase_info             : PropTypes.object,
    togglePurchaseLock        : PropTypes.func,
    trade_types               : PropTypes.object,
    validation_errors         : PropTypes.object,
};

export default connect(
    ({ client, modules, ui }) => ({
        currency                  : client.currency,
        is_client_allowed_to_visit: client.is_client_allowed_to_visit,
        is_contract_mode          : modules.smart_chart.is_contract_mode,
        basis                     : modules.trade.basis,
        contract_type             : modules.trade.contract_type,
        is_purchase_enabled       : modules.trade.is_purchase_enabled,
        is_trade_enabled          : modules.trade.is_trade_enabled,
        onClickPurchase           : modules.trade.onPurchase,
        onHoverPurchase           : modules.trade.onHoverPurchase,
        proposal_info             : modules.trade.proposal_info,
        purchase_info             : modules.trade.purchase_info,
        trade_types               : modules.trade.trade_types,
        validation_errors         : modules.trade.validation_errors,
        is_purchase_confirm_on    : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(Purchase);
