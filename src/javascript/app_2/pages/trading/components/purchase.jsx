import React        from 'react';
import PropTypes    from 'prop-types';
import Button       from '../../../components/form/button.jsx';
import Tooltip      from '../../../components/elements/tooltip.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import { connect }  from '../../../store/connect';
import { localize } from '../../../../_common/localize';
import Url          from '../../../../_common/url';

const Purchase = ({
    proposal_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info = proposal_info[type] || {};
        return (
            <Fieldset className='purchase-option' key={idx} tooltip={info.message}>
                <div className='box'>
                    <div className='left-column'>
                        <img src={Url.urlForStatic(`images/trading_app/purchase/ic_${trade_types[type].toLowerCase()}.svg`) || undefined} />
                        <h4 className='trade-type'>{type.toLowerCase()}</h4>
                    </div>
                    <div className='right-column'>
                        <span>{localize('Return')}: {info.returns}%</span>
                        <span>{localize('Stake')}: {info.stake}</span>
                        <span>{localize('Net Profit')}: {info.profit}</span>
                        <span>{localize('Payout')}: {info.payout}</span>
                    </div>
                </div>
                <div className='submit-section'>
                    <Tooltip
                        alignment='left'
                        message={localize('Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.')}
                    >
                        <Button
                            id={`purchase_${type}`}
                            className='primary green'
                            has_effect
                            text={localize('Purchase')}
                        />
                    </Tooltip>
                </div>
            </Fieldset>
        );
    })
);

Purchase.propTypes = {
    trade_types: PropTypes.object,
};

Tooltip.propTypes= {
    alignment: PropTypes.string,
    message  : PropTypes.string,
};

export default connect(
    ({ trade }) => ({
        trade_types  : trade.trade_types,
        proposal_info: trade.proposal_info,
    })
)(Purchase);
