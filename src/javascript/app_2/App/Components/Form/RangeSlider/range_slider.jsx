import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import TickSteps    from './tick_steps.jsx';

const RangeSlider = ({
    className,
    min,
    max,
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
                    min={min}
                    max={max}
                    name={name}
                    steps='1'
                    onChange={handleChange}
                    tabIndex='0'
                    value={value}
                />
                <div className='ticks'>
                    <TickSteps
                        value={value}
                        ticks={max}
                        onClick={handleClick}
                    />
                </div>
                {/* Calculate line width based on active value and size of range thumb */}
                <div className='range-slider__line' style={{ width: `calc(${value * 10}% - 0.5rem)` }} />
            </label>
            <div className='range-slider__caption'>
                <span className='range-slider__caption--min'>
                    {min}
                </span>
                {
                    !!value &&
                    <span className='range-slider__caption--current'>
                        {localize('[_1] Ticks', value || '')}
                    </span>
                }
                <span className='range-slider__caption--max'>
                    {max}
                </span>
            </div>
        </div>
    );
};

RangeSlider.propTypes = {
    className: PropTypes.string,
    max      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    min: PropTypes.oneOfType([
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
