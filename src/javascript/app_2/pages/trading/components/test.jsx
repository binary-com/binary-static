import React from 'react';
import { connect } from '../../../store/connect';

const Test = ({
    entries,
    json,
    // active_symbols,
}) =>  (
    <React.Fragment>
        <div style={{ fontSize: '10px', lineHeight: '15px' }}>
            {entries.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v && typeof v === 'object' ? JSON.stringify(v) : v}</div>)}
            <br />
            {json}
        </div>
    </React.Fragment>
);

export default connect(
    ({trade}) => ({
        entries       : Object.entries(trade),
        json          : JSON.stringify(trade).replace(/(:|,)/g, '$1 '),
        active_symbols: trade.active_symbols,

    })
)(Test);
