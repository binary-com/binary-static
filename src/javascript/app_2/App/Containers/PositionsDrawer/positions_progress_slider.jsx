import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { connect }         from 'Stores/connect';
import { localize }        from '_common/localize';
import { getDiffDuration,
    daysFromTodayTo } from 'Utils/Date';
import ProgressTicks       from '../../Components/Elements/PositionsDrawer/positions_progress_ticks.jsx';

const ProgressSlider = ({
    className,
    expiry_time = null,
    start_time,
}) => {
    if (!+expiry_time || start_time.unix() > +expiry_time) {
        return '';
    }
    const remaining_time = getDiffDuration(start_time.unix(), expiry_time);
    console.log(remaining_time);
    console.log(daysFromTodayTo(expiry_time));
    const ticks = !expiry_time || null;
    return (
        <div className={classNames('progress-slider', className)}>
            {(ticks) ?
                <React.Fragment>
                    <span className='progress-slider__ticks-caption'>
                        {localize('Tick [_1]', expiry_time)}
                    </span>
                    <div className='progress-slider__ticks'>
                        <ProgressTicks
                            ticks={ticks}
                        />
                    </div>
                </React.Fragment>
                :
                <div className='progress-slider__default' />
            }
            {/* Calculate line width based on active value and size of range thumb */}
            <div
                className='progress-slider__line'
                style={{ width: `calc(${expiry_time * 10}% - ${expiry_time < 4 ? '0.8rem' : '0.5rem'})` }}
            />
        </div>
    );
};
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
