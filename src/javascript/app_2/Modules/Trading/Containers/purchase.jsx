import PropTypes         from 'prop-types';
import React             from 'react';
import ContractInfo      from '../Components/Form/Purchase/contract_info.jsx';
import MessageBox        from '../Components/Form/Purchase/MessageBox';
import { PopConfirm }    from '../../../App/Components/Elements/PopConfirm';
import UILoader          from '../../../App/Components/Elements/ui_loader.jsx';
import Button            from '../../../App/Components/Form/button.jsx';
import Fieldset          from '../../../App/Components/Form/fieldset.jsx';
import { connect }       from '../../../Stores/connect';
import { localize }      from '../../../../_common/localize';
import { isEmptyObject } from '../../../../_common/utility';

const Purchase = ({
    barrier_count,
    currency,
    is_purchase_confirm_on,
    is_purchase_enabled,
    is_purchase_locked,
    is_trade_enabled,
    onClickPurchase,
    onHoverPurchase,
    proposal_info,
    purchase_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info        = proposal_info[type] || {};
        const is_disabled = !is_purchase_enabled || !is_trade_enabled || !info.id || is_purchase_locked;

        const purchase_button = (
            <Button
                is_disabled={is_disabled}
                id={`purchase_${type}`}
                className='primary green'
                has_effect
                text={localize('Purchase')}
                onClick={() => { onClickPurchase(info.id, info.stake); }}
                wrapperClassName='submit-section'
            />
        );

        return (
            <Fieldset
                className='purchase-option'
                key={idx}
                onMouseEnter={() => { onHoverPurchase(true, type); }}
                onMouseLeave={() => { onHoverPurchase(false); }}
            >
                {(!isEmptyObject(purchase_info) && purchase_info.echo_req.buy === info.id) ?
                    <MessageBox purchase_info={purchase_info} />
                    :
                    <React.Fragment>
                        {/* // TODO - move this outside of the loop  */}
                        {!is_purchase_enabled &&
                        <UILoader />
                        }
                        <ContractInfo
                            barrier_count={barrier_count}
                            contract_title={trade_types[type]}
                            contract_type={type}
                            currency={currency}
                            proposal_info={info}
                        />
                        {is_purchase_confirm_on ?
                            <PopConfirm
                                alignment='left'
                                cancel_text='Cancel'
                                confirm_text='Purchase'
                                message='Are you sure you want to purchase this contract?'
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
    barrier_count         : PropTypes.number,
    currency              : PropTypes.string,
    is_purchase_enabled   : PropTypes.bool,
    is_purchase_confirm_on: PropTypes.bool,
    is_purchase_locked    : PropTypes.bool,
    is_trade_enabled      : PropTypes.bool,
    onClickPurchase       : PropTypes.func,
    onHoverPurchase       : PropTypes.func,
    proposal_info         : PropTypes.object,
    purchase_info         : PropTypes.object,
    trade_types           : PropTypes.object,
};

export default connect(
    ({ modules, ui }) => ({
        barrier_count         : modules.trade.barrier_count,
        is_purchase_enabled   : modules.trade.is_purchase_enabled,
        is_trade_enabled      : modules.trade.is_trade_enabled,
        onClickPurchase       : modules.trade.onPurchase,
        onHoverPurchase       : modules.trade.onHoverPurchase,
        proposal_info         : modules.trade.proposal_info,
        purchase_info         : modules.trade.purchase_info,
        trade_types           : modules.trade.trade_types,
        is_purchase_confirm_on: ui.is_purchase_confirm_on,
        is_purchase_locked    : ui.is_purchase_lock_on,
    })
)(Purchase);
