import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import ProgressTicks         from './positions-progress-ticks.jsx';
import RemainingTime         from '../../../../Containers/remaining-time.jsx';

const ProgressSlider = ({
    className,
    has_result,
    ticks_count,
    current_tick,
    percentage,
    remaining_time,
}) => {
    if (!percentage && !ticks_count || has_result || !remaining_time) return <div className='progress-slider--completed' />;
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
                        <RemainingTime end_time={remaining_time} />
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
    className     : PropTypes.string,
    current_tick  : PropTypes.number,
    has_result    : PropTypes.bool,
    percentage    : PropTypes.number,
    remaining_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    ticks_count: PropTypes.number,
};

export default ProgressSlider;
