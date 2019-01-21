import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import TickSteps    from './tick_steps.jsx';

const RangeSlider = ({
    className,
    min_value,
    max_value,
    first_tick,
    last_tick,
    name,
    onChange,
    value,
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

    return (
        <div className={classNames('range-slider', className)}>
            <label htmlFor='range'>
                <input
                    id='range'
                    className='range-slider__track'
                    type='range'
                    min={first_tick}
                    max={last_tick}
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
                        ticks={last_tick}
                        onClick={handleClick}
                    />
                </div>
                {/* Calculate line width based on active value and size of range thumb */}
                <div className='range-slider__line' style={{ width: `calc(${value * 10}% - ${value < 4 ? '0.8rem' : '0.5rem'})` }} />
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
                    {last_tick}
                </span>
            </div>
        </div>
    );
};

RangeSlider.propTypes = {
    className : PropTypes.string,
    first_tick: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    last_tick: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    max_value: PropTypes.oneOfType([
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
