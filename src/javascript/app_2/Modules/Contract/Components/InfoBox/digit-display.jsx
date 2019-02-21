import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';

const DigitDisplay = ({
    digit_info = {},
    digit_number,
}) => {
    const digit_class = classNames(
        'digit-value',
        digit_info.is_win ? 'win' : 'loss',
        { last: digit_info.is_last },
    );

    return (
        <div className='digit-info'>
            <div className={digit_class}>{digit_info.digit}</div>
            <div className='tick-number'>{localize('Tick [_1]', [digit_number])}</div>
        </div>
    );
};

DigitDisplay.propTypes = {
    digit_info  : PropTypes.object,
    digit_number: PropTypes.number,
};

export default observer(DigitDisplay);
