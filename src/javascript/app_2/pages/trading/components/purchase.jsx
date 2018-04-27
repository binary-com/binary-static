import React from 'react';
import Button from '../../../components/form/button.jsx';
import { connect } from '../../../store/connect';
// import { localize } from '../../../../_common/localize';

const Purchase = ({
    trade_types,
}) =>  (
    <fieldset>
        {Object.keys(trade_types).map((type, idx) => (
            <div key={idx} className='purchase-option'>
                <div><span>test</span></div>
                <div><span>test</span></div>
                <div>
                    <Button
                        id={`purchase_${type}`}
                        className='primary green'
                        has_effect
                        text={trade_types[type]}
                    />2
                </div>
            </div>
        ))}
    </fieldset>
);

export default connect(
    ({trade}) => ({
        trade_types: trade.trade_types,
    })
)(Purchase);
