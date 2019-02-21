import { observer }   from 'mobx-react';
import PropTypes      from 'prop-types';
import React          from 'react';
import { localize }   from '_common/localize';
import DigitDisplay   from './digit-display.jsx';
import InfoBoxExpired from './info-box-expired.jsx';

const InfoBoxDigit = ({
    contract_info,
    digits_info,
    is_ended,
}) => {
    const digits_array = Object.keys(digits_info).sort().map(spot_time => digits_info[spot_time]);
    const count = +contract_info.tick_count;
    const latest_digit = digits_array.slice(-1)[0] || {};
    const display_array = [...Array(count).keys()].map(i => {
        // manually put the last one at the end because some ticks are missing from responses
        const last_item = i + 1 === count && latest_digit.is_last ? latest_digit : {};
        return digits_array[i] && !digits_array[i].is_last ? digits_array[i] : last_item;
    });

    return (
        <div className='digits'>
            <div className='digit-title'>{localize('Last Digit')}</div>
            <div className='digit-list'>
                { display_array.map((info, idx) => (
                    <DigitDisplay digit_info={info} digit_number={idx + 1} key={idx} />
                ))}
            </div>
            <InfoBoxExpired
                contract_info={contract_info}
                has_flag={is_ended}
                has_percentage={is_ended}
            />
        </div>
    );
};

InfoBoxDigit.propTypes = {
    contract_info: PropTypes.object,
    digits_info  : PropTypes.object,
    is_ended     : PropTypes.bool,
};

export default observer(InfoBoxDigit);
