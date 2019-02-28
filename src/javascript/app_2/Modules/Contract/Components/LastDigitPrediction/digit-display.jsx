import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Digit        from './digit.jsx';
import DigitSpot    from './digit-spot.jsx';

const DigitDisplay = ({
    digit_value,
    is_ended,
    latest_digit,
    selected_digit,
}) => {
    const { digit, is_win, spot } = latest_digit;

    const is_latest_digit   = digit_value === digit;
    const is_selected_digit = digit_value === selected_digit;
    
    const is_won = is_ended && digit_value === digit && is_win;
    // need to explicitly have is_loss condition here
    // because negating is_won would always be true,
    // but we only need is_loss condition only once we have the is_win result
    const is_loss = is_ended && digit_value === digit && !is_win;
    return (
        <div
            className={classNames('digits__digit', {
                'digits__digit--win' : is_won,
                'digits__digit--loss': is_loss,
            })}
        >
            { is_latest_digit && spot &&
                <DigitSpot
                    current_spot={spot}
                    is_loss={is_loss}
                    is_won={is_won}
                />
            }
            <Digit
                is_latest_digit={is_latest_digit}
                is_selected_digit={is_selected_digit}
                is_loss={is_loss}
                is_won={is_won}
                value={digit_value}
            />
        </div>
    );
};

DigitDisplay.propTypes = {
    digit_value   : PropTypes.number,
    is_ended      : PropTypes.bool,
    latest_digit  : PropTypes.object,
    selected_digit: PropTypes.number,
};

export default observer(DigitDisplay);
