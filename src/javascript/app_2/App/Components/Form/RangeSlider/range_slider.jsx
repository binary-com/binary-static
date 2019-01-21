import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import TickSteps    from './tick_steps.jsx';

const RangeSlider = ({
    className,
    ticks,
    max_value,
    min_value,
    name,
    value,
    onChange,
}) => {

    const handleChange = (e) => {
        if (e.target.value !== value) {
            onChange({ target: { name, value: e.target.value } });
        }
    };

    const handleClick = (e, index) => {
        if (index !== value) {
            onChange({ target: { name, value: index } });
        }
    };

    const first_tick = ticks - (ticks - 1);

    const is_error = ((value < min_value) || (value > max_value)) ? 'error' : '';

    return (
        <div className={classNames('range-slider', className, { 'error': is_error })}>
            <label htmlFor='range'>
                <input
                    id='range'
                    className='range-slider__track'
                    type='range'
                    min={first_tick}
                    max={ticks}
                    min_value={min_value}
                    max_value={max_value}
                    name={name}
                    steps='1'
                    onChange={handleChange}
                    tabIndex='0'
                    value={value}
                />
                <div className='ticks'>
                    <TickSteps
                        value={value}
                        ticks={ticks}
                        onClick={handleClick}
                    />
                </div>
                {/* Calculate line width based on active value and size of range thumb */}
                <div
                    className='range-slider__line'
                    style={{ width: `calc(${value * 10}% - ${value < 4 ? '0.8rem' : '0.5rem'})` }}
                />
            </label>
            <div className='range-slider__caption'>
                <span>
                    {first_tick}
                </span>
                {
                    !!value &&
                    <span>
                        {localize('[_1] Ticks', value || '')}
                    </span>
                }
                <span>
                    {ticks}
                </span>
            </div>
        </div>
    );
};

RangeSlider.propTypes = {
    className : PropTypes.string,
    first_tick: PropTypes.number,
    max_value : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    min_value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(RangeSlider);
