import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from '../../../store/connect';

const Test = ({
    entries,
    json,
}) =>  (
    <div style={{ fontSize: '10px', lineHeight: '15px' }}>
        {entries.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v && typeof v === 'object' ? JSON.stringify(v) : v}</div>)}
        <br />
        {json}
    </div>
);

Test.propTypes = {
    entries: PropTypes.array,
    json   : PropTypes.string,
};

export default connect(
    ({trade}) => ({
        entries: Object.entries(trade),
        json   : JSON.stringify(trade).replace(/(:|,)/g, '$1 '),
    })
)(Test);
