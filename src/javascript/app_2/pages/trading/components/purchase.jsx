import React from 'react';
import Button from '../../../components/form/button.jsx';
import { connect } from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const Purchase = ({
    proposals,
    trade_types,
}) =>  (
    <fieldset>
        {Object.keys(proposals).map((type, idx) => (
            <p key={idx}>{proposals[type].message}</p>
        ))}
        {Object.keys(trade_types).map((type, idx) => (
            <Button
                key={idx}
                id={`purchase_${type}`}
                className='primary green'
                has_effect
                text={`${localize('Purchase')} ${trade_types[type]}`}
            />
        ))}
    </fieldset>
);

export default connect(
    ({trade}) => ({
        trade_types: trade.trade_types,
        proposals  : trade.proposals,
    })
)(Purchase);
