import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { localize }                   from '_common/localize';
import { isEmptyObject }              from '_common/utility';
import Money                          from 'App/Components/Elements/money.jsx';
import { PopConfirm }                 from 'App/Components/Elements/PopConfirm';
import UILoader                       from 'App/Components/Elements/ui_loader.jsx';
import Button                         from 'App/Components/Form/button.jsx';
import Fieldset                       from 'App/Components/Form/fieldset.jsx';
import { IconTradeType }              from 'Assets/Trading/Types';
import { connect }                    from 'Stores/connect';
import ContractInfo                   from '../Components/Form/Purchase/contract_info.jsx';
import MessageBox                     from '../Components/Form/Purchase/MessageBox';
import PurchaseLock                   from '../Components/Form/Purchase/PurchaseLock';

const Purchase = ({
    barrier_count,
    basis,
    basis_list,
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
    proposal_info_req_id,
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
                className='primary green btn-purchase'
                has_effect
                onClick={() => { onClickPurchase(info.id, info.stake, type); }}
                wrapperClassName='submit-section'
            >
                <React.Fragment>
                    <div className='btn-purchase__rec' />
                    <div className='btn-purchase__tri' />
                    <div className='btn-purchase__content'>
                        <div className='btn-purchase__content__trade-type'>
                            <IconTradeType type={type.toLowerCase()} />
                            <span>{localize('[_1]', trade_types[type])}</span>
                        </div>
                    </div>
                    <div className='btn-purchase__info'>
                        <div className='btn-purchase__info__return'>{info.returns}</div>
                        <div className='btn-purchase__info__profit'>
                            <Money amount={info.payout} currency={currency} />
                        </div>
                    </div>
                </React.Fragment>
            </Button>
        );

        const is_purchase_error = (!isEmptyObject(purchase_info) && purchase_info.echo_req.buy === info.id);
        const contract_basis    = (basis_list.find(o => o.value !== basis));

        return (
            <Fieldset
                className='purchase-option'
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
                        <UILoader />
                        }
                        <ContractInfo
                            barrier_count={barrier_count}
                            basis={basis}
                            contract_basis={contract_basis}
                            contract_title={trade_types[type]}
                            contract_type={type}
                            currency={currency}
                            proposal_info={info}
                            proposal_info_req_id={proposal_info_req_id}
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
    barrier_count             : PropTypes.number,
    basis                     : PropTypes.string,
    basis_list                : MobxPropTypes.arrayOrObservableArray,
    currency                  : PropTypes.string,
    is_client_allowed_to_visit: PropTypes.bool,
    is_purchase_confirm_on    : PropTypes.bool,
    is_purchase_enabled       : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    is_trade_enabled          : PropTypes.bool,
    onClickPurchase           : PropTypes.func,
    onHoverPurchase           : PropTypes.func,
    proposal_info             : PropTypes.object,
    proposal_info_req_id      : PropTypes.number,
    purchase_info             : PropTypes.object,
    resetPurchase             : PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
    trade_types               : PropTypes.object,
};

export default connect(
    ({ client, modules, ui }) => ({
        currency                  : client.currency,
        is_client_allowed_to_visit: client.is_client_allowed_to_visit,
        barrier_count             : modules.trade.barrier_count,
        basis                     : modules.trade.basis,
        basis_list                : modules.trade.basis_list,
        is_purchase_enabled       : modules.trade.is_purchase_enabled,
        is_trade_enabled          : modules.trade.is_trade_enabled,
        onClickPurchase           : modules.trade.onPurchase,
        onHoverPurchase           : modules.trade.onHoverPurchase,
        resetPurchase             : modules.trade.requestProposal,
        proposal_info             : modules.trade.proposal_info,
        proposal_info_req_id      : modules.trade.proposal_info_req_id,
        purchase_info             : modules.trade.purchase_info,
        trade_types               : modules.trade.trade_types,
        is_purchase_confirm_on    : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(Purchase);
