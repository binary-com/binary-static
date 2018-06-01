import React        from 'react';
import Button       from '../../../components/form/button.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import { connect }  from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const Purchase = ({
    proposal_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info = proposal_info[type] || {};
        return (
            <Fieldset key={idx} header={type} tooltip={info.message}>
                <div>{localize('Return')}: {info.returns}%</div>
                <div>{localize('Stake')}: {info.stake}</div>
                <div>{localize('Net Profit')}: {info.profit}</div>
                <div>{localize('Payout')}: {info.payout}</div>
                <Button
                    id={`purchase_${type}`}
                    className='primary green'
                    has_effect
                    text={`${localize('Purchase')} ${trade_types[type]}`}
                />
            </Fieldset>
        );
    })
);

export default connect(
    ({ trade }) => ({
        trade_types  : trade.trade_types,
        proposal_info: trade.proposal_info,
    })
)(Purchase);
