import PropTypes from 'prop-types';
import React     from 'react';

const DigitSelector = ({
    name,
    onChange,
    selected_digit,
}) => {
    const handleSelect = (item) => {
        if (+item.target.getAttribute('data-value') !== selected_digit) {
            onChange({ target: { name, value: +item.target.getAttribute('data-value') } });
        }
    };

    const arr_five = [...Array(5).keys()];

    return (
        <div className='digit-selector'>
            <div>
                {arr_five.map(i =>
                    <span
                        key={i}
                        className={`digit-selector__selection${selected_digit === i ? ' selected' : ''}`}
                        data-value={i}
                        onClick={handleSelect}
                    >
                        {i}
                    </span>
                )}
            </div>
            <div>
                {arr_five.map(i => i + 5).map(i =>
                    <span
                        key={i}
                        className={`digit-selector__selection${selected_digit === i ? ' selected' : ''}`}
                        data-value={i}
                        onClick={handleSelect}
                    >
                        {i}
                    </span>
                )}
            </div>
        </div>
    );
};

DigitSelector.propTypes = {
    name          : PropTypes.string,
    onChange      : PropTypes.func,
    selected_digit: PropTypes.number,
};

export default DigitSelector;
