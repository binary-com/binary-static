import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';

const ProgressTicks = ({ current_tick, ticks_count }) => {
    const arr_ticks = [...Array(ticks_count).keys()];
    // TODO: temporary infinite/indeterminate loader
    // if (!current_tick) return <div className='progress-slider__infinite-loader'><div className='progress-slider__infinite-loader--indeterminate' /></div>;
    return (
        // TODO: Update and show once design for ticks progress bar is finalized
        <div>
            <span className='progress-slider__ticks-caption'>
                {localize('Tick [_1]', (current_tick < 0) ? 0 : current_tick)}
            </span>
            <div className='progress-slider__track--ticks'>
                <div className='progress-slider__ticks'>
                    {arr_ticks.map(idx =>
                        <span
                            key={idx}
                            className={classNames('ticks__step', {
                                'ticks__step--active': (idx + 1) === parseInt(current_tick),
                                'ticks__step--marked': (idx + 1) < parseInt(current_tick),
                            })}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

ProgressTicks.propTypes = {
    // current_tick: PropTypes.number,
    ticks_count: PropTypes.number,
};

export default ProgressTicks;
