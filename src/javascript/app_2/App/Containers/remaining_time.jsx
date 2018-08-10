import PropTypes       from 'prop-types';
import React           from 'react';
import { connect }     from '../../Stores/connect';
import {
    formatDuration,
    getDiffDuration }  from '../../Utils/Date';

const RemainingTime = ({ start_time, end_time = null }) => {
    const remaining_time = formatDuration(getDiffDuration(start_time.unix(), end_time));

    return (
        <div className='remaining-time'>{remaining_time}</div>
    );
};

RemainingTime.propTypes = {
    end_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    start_time: PropTypes.object,
};

export default connect(
    ({ common }) => ({
        start_time: common.server_time,
    })
)(RemainingTime);
