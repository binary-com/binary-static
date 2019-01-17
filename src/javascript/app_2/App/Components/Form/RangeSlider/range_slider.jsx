import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';

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

    const renderTickSteps = (ticks) => {
        const arr_ticks_el = [];
        for (let idx = 0; idx < ticks; idx++) {
            arr_ticks_el.push(
                <span
                    key={idx}
                    className={classNames('ticks__step', {
                        'ticks__step--active': (idx + 1) === parseInt(value),
                        'ticks__step--marked': (idx + 1) < parseInt(value),
                    })}
                    onClick={(e) => handleClick(e, idx + 1)}
                />);
        }
        return arr_ticks_el;
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
                    {renderTickSteps(max)}
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
