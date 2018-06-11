import React          from 'react';
import PropTypes      from 'prop-types';
import Button         from '../../../components/form/button.jsx';
import Fieldset       from '../../../components/form/fieldset.jsx';
import { connect }    from '../../../store/connect';
import { localize }   from '../../../../_common/localize';
import {
    getPropertyValue,
    isEmptyObject }   from '../../../../_common/utility';

const Purchase = ({
    onClickPurchase,
    proposal_info,
    purchase_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info = proposal_info[type] || {};
        return (
            <Fieldset key={idx} header={type} tooltip={info.message}>
                {(!isEmptyObject(purchase_info) && purchase_info.echo_req.buy === info.id) ?
                    <div>
                        {getPropertyValue(purchase_info, ['error', 'message']) || JSON.stringify(purchase_info.buy)}
                    </div>
                    :
                    <React.Fragment>
                        {(info.has_error || !info.id) ?
                            <div>{info.message}</div>
                            :
                            <React.Fragment>
                                <div>{localize('Return')}: {info.returns}</div>
                                <div>{localize('Stake')}: {info.stake}</div>
                                <div>{localize('Net Profit')}: {info.profit}</div>
                                <div>{localize('Payout')}: {info.payout}</div>
                            </React.Fragment>
                        }
                        <Button
                            is_disabled={!info.id}
                            id={`purchase_${type}`}
                            className='primary green'
                            has_effect
                            text={`${localize('Purchase')} ${trade_types[type]}`}
                            onClick={() => { onClickPurchase(info.id, 999); }}
                        />
                    </React.Fragment>
                }
            </Fieldset>
        );
    })
);

Purchase.propTypes = {
    onClickPurchase: PropTypes.func,
    proposal_info  : PropTypes.object,
    purchase_info  : PropTypes.object,
    trade_types    : PropTypes.object,
};

export default connect(
    ({ trade }) => ({
        onClickPurchase: trade.onPurchase,
        proposal_info  : trade.proposal_info,
        purchase_info  : trade.purchase_info,
        trade_types    : trade.trade_types,
    })
)(Purchase);
