import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { connect }         from 'Stores/connect';
import { getTimePercentage } from '../helpers';
import ProgressTicks       from '../../../Components/Elements/PositionsDrawer/positions_progress_ticks.jsx';
import RemainingTime       from '../../remaining_time.jsx';

const ProgressSlider = ({
    className,
    ticks_count,
    current_tick,
    purchase_time,
    expiry_time,
    start_time,
}) => {
    const percentage = getTimePercentage(start_time, purchase_time, expiry_time);
    return (
        <div className={classNames('progress-slider', className)}>
            {(ticks_count < 5) ?
                <ProgressTicks
                    current_tick={current_tick}
                    ticks_count={ticks_count}
                />
                :
                <React.Fragment>
                    <span className='positions-drawer-card__remaining-time'>
                        <RemainingTime end_time={expiry_time} />
                    </span>
                    {/* Calculate line width based on percentage of time left */}
                    <div className='progress-slider__track'>
                        <div
                            className={classNames('progress-slider__line', {
                                'progress-slider__line--green' : (percentage >= 50),
                                'progress-slider__line--orange': (percentage < 50 && percentage >= 20),
                                'progress-slider__line--red'   : (percentage < 20),
                            })}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </React.Fragment>
            }
        </div>
    );
};
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

ProgressSlider.propTypes = {
    className   : PropTypes.string,
    current_tick: PropTypes.number,
    expiry_time : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    purchase_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time : PropTypes.object,
    ticks_count: PropTypes.number,
};

export default connect(
    ({ common }) => ({
        start_time: common.server_time,
    })
)(ProgressSlider);
