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

    return (
        <div className='digit-selector center-text'>
            {[...Array(10).keys()].map(i =>
                <div
                    key={i}
                    className={`digit-selection${selected_digit === i ? ' selected' : ''}`}
                    data-value={i}
                    onClick={handleSelect}
                >
                    {i}
                </div>
            )}
        </div>
    );
};

DigitSelector.propTypes = {
    name          : PropTypes.string,
    onChange      : PropTypes.func,
    selected_digit: PropTypes.number,
};

export default DigitSelector;
