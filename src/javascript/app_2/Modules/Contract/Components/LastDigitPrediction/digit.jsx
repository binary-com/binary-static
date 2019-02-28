import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const Digit = ({
    is_latest_digit,
    is_selected_digit,
    is_loss,
    is_won,
    value,
}) => (
    <span
        className={classNames('digits__digit-value', {
            'digits__digit-value--latest'  : is_latest_digit,
            'digits__digit-value--selected': is_selected_digit,
            'digits__digit-value--win'     : is_won,
            'digits__digit-value--loss'    : is_loss,
        })}
    >
        {value}
    </span>
);

Digit.propTypes = {
    is_latest_digit  : PropTypes.bool,
    is_loss          : PropTypes.bool,
    is_selected_digit: PropTypes.bool,
    is_won           : PropTypes.bool,
    value            : PropTypes.number,
};

export default Digit;
