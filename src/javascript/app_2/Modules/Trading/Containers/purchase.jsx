import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { isEmptyObject } from '_common/utility';
import Money             from 'App/Components/Elements/money.jsx';
import { PopConfirm }    from 'App/Components/Elements/PopConfirm';
import UILoader          from 'App/Components/Elements/ui_loader.jsx';
import Button            from 'App/Components/Form/button.jsx';
import Fieldset          from 'App/Components/Form/fieldset.jsx';
import { IconTradeType } from 'Assets/Trading/Types';
import { connect }       from 'Stores/connect';
import ContractInfo      from '../Components/Form/Purchase/contract_info.jsx';
import MessageBox        from '../Components/Form/Purchase/MessageBox';
import PurchaseLock      from '../Components/Form/Purchase/PurchaseLock';

const Purchase = ({
    currency,
    is_client_allowed_to_visit,
    is_purchase_confirm_on,
    is_purchase_enabled,
    is_purchase_locked,
    is_trade_enabled,
    onClickPurchase,
    onHoverPurchase,
    togglePurchaseLock,
    resetPurchase,
    proposal_info,
    purchase_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info        = proposal_info[type] || {};
        const is_disabled = !is_purchase_enabled || !is_trade_enabled || !info.id || !is_client_allowed_to_visit;

        const purchase_button = (
            <Button
                is_disabled={is_disabled}
                id={`purchase_${type}`}
                className='primary btn-purchase'
                has_effect
                onClick={() => { onClickPurchase(info.id, info.stake, type); }}
            >
                <React.Fragment>
                    <div className='btn-purchase__effect-main' />
                    <div className='btn-purchase__effect-detail' />
                    <div className='btn-purchase__content'>
                        <div className='btn-purchase__trade-type'>
                            <IconTradeType type={type.toLowerCase()} className='btn-purchase__trade-type-icon' />
                            <span className='btn-purchase__trade-type-text'>{localize('[_1]', trade_types[type])}</span>
                        </div>
                    </div>
                    <div className='btn-purchase__info'>
                        <div className='btn-purchase__return'>{is_disabled ? '---,-' : info.returns}</div>
                        <div className='btn-purchase__profit'>
                            {is_disabled ? '--,--' : <Money amount={info.profit} currency={currency} className='btn-purchase__currency' />}
                        </div>
                    </div>
                </React.Fragment>
            </Button>
        );

        const is_purchase_error = (!isEmptyObject(purchase_info) && purchase_info.echo_req.buy === info.id);

        return (
            <Fieldset
                className='trade-container__fieldset purchase-container__option'
                key={idx}
                onMouseEnter={() => { onHoverPurchase(true, type); }}
                onMouseLeave={() => { onHoverPurchase(false); }}
            >
                {(is_purchase_locked && idx === 0) &&
                <PurchaseLock onClick={togglePurchaseLock} />
                }
                {(is_purchase_error) ?
                    <MessageBox
                        purchase_info={purchase_info}
                        onClick={resetPurchase}
                        currency={currency}
                    />
                    :
                    <React.Fragment>
                        {(!is_purchase_enabled && idx === 0) &&
                        <UILoader classNameBlock='purchase-container__loading' />
                        }
                        <ContractInfo
                            currency={currency}
                            proposal_info={info}
                            has_increased={info.has_increased}
                        />
                        {is_purchase_confirm_on ?
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
                    </React.Fragment>
                }
            </Fieldset>
        );
    })
);

Purchase.propTypes = {
    currency                  : PropTypes.string,
    is_client_allowed_to_visit: PropTypes.bool,
    is_purchase_confirm_on    : PropTypes.bool,
    is_purchase_enabled       : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    is_trade_enabled          : PropTypes.bool,
    onClickPurchase           : PropTypes.func,
    onHoverPurchase           : PropTypes.func,
    proposal_info             : PropTypes.object,
    purchase_info             : PropTypes.object,
    resetPurchase             : PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
    trade_types               : PropTypes.object,
};

export default connect(
    ({ client, modules, ui }) => ({
        currency                  : client.currency,
        is_client_allowed_to_visit: client.is_client_allowed_to_visit,
        is_purchase_enabled       : modules.trade.is_purchase_enabled,
        is_trade_enabled          : modules.trade.is_trade_enabled,
        onClickPurchase           : modules.trade.onPurchase,
        onHoverPurchase           : modules.trade.onHoverPurchase,
        resetPurchase             : modules.trade.requestProposal,
        proposal_info             : modules.trade.proposal_info,
        purchase_info             : modules.trade.purchase_info,
        trade_types               : modules.trade.trade_types,
        is_purchase_confirm_on    : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(Purchase);
