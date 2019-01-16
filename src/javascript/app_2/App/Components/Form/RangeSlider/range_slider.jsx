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
    steps,
    value,
}) => {

    const handleChange = (e) => {
        if (e.target.value !== value) {
            onChange({ target: { name, value: e.target.value } });
        }
    };

    return (
        <div className={classNames('range-slider', className)}>
            <label htmlFor='range'>
                <input
                    id='range'
                    className='range-slider__range'
                    type='range'
                    min={min}
                    max={max}
                    name={name}
                    steps={steps}
                    onChange={handleChange}
                    tabIndex='0'
                />
            </label>
            <div className='range-slider__label'>
                <span className='range-slider__label--min'>
                    {min}
                </span>
                <span className='range-slider__label--current'>
                    {localize('[_1] Ticks', value || '0')}
                </span>
                <span className='range-slider__label--max'>
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
    steps   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(RangeSlider);
