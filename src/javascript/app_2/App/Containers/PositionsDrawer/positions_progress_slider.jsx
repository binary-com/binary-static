import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { connect }         from 'Stores/connect';
import { localize }        from '_common/localize';
import ProgressTicks       from '../../Components/Elements/PositionsDrawer/positions_progress_ticks.jsx';

const ProgressSlider = ({
    className,
    tick_count,
    current_tick,
    percentage = 50,
}) => (
    <div className={classNames('progress-slider', className)}>
        {tick_count ?
            <React.Fragment>
                <span className='progress-slider__ticks-caption'>
                    {localize('Tick [_1]', current_tick)}
                </span>
                <div className='progress-slider__ticks'>
                    <ProgressTicks
                        ticks={tick_count}
                    />
                </div>
            </React.Fragment>
            :
            <div className='progress-slider__default' />
        }
        {/* Calculate line width based on active value and size of range thumb */}
        <div
            className='progress-slider__line'
            style={{ width: `${percentage}%` }}
        />
    </div>
);
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

ProgressSlider.propTypes = {
    className  : PropTypes.string,
    expiry_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    start_time: PropTypes.object,
};

export default connect(
    ({ common }) => ({
        start_time: common.server_time,
    })
)(ProgressSlider);
