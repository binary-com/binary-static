import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const DigitSpot = ({
    current_spot,
    is_loss,
    is_won,
}) => (
    <div className='digits__digit-spot'>
        {current_spot.slice(0, -1)}
        <span
            className={classNames('digits__digit-spot-last-digit', {
                'digits__digit-spot-last-digit--win' : is_won,
                'digits__digit-spot-last-digit--loss': is_loss,
            })}
        >
            {current_spot.slice(-1)}
        </span>
    </div>
);

DigitSpot.propTypes = {
    current_spot: PropTypes.string,
    is_loss     : PropTypes.bool,
    is_won      : PropTypes.bool,
};

export default DigitSpot;
