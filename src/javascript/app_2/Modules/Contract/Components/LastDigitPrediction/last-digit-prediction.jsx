import { observer }       from 'mobx-react';
import PropTypes          from 'prop-types';
import React              from 'react';
import DigitDisplay       from './digit-display.jsx';
import LastDigitParticles from './last-digit-particles.jsx';
import LastDigitPointer   from './last-digit-pointer.jsx';

const display_array = Array.from(Array(10).keys()); // digits array [0 - 9]
class LastDigitPrediction extends React.Component {
    state = {};

    componentDidMount() {
        this.node.querySelectorAll('.digits__digit').forEach((el, idx) => {
            // get offsetLeft of each Digits
            this.setState({
                [idx]: el.offsetLeft,
            });
        });
    }

    render() {
        const { barrier, contract_type, digits_info, is_ended, status } = this.props;
        const digits_array = Object.keys(digits_info).sort().map(spot_time => digits_info[spot_time]);
        const latest_digit = digits_array.slice(-1)[0] || {};

        // 'won' or 'lost' status exists after contract expiry
        const is_won  = is_ended && status === 'won';
        // need to explicitly have is_lost condition here
        // because negating is_won would always be true,
        // but we only need is_lost condition only once we have the 'won' or 'lost' status
        const is_lost = is_ended && status === 'lost';

        const position = this.state[latest_digit.digit];

        const getBarrier = (idx) => {
            if (contract_type === 'DIGITEVEN') {
                return (idx % 2 === 0) ? idx : null; // return even numbers
            } else if (contract_type === 'DIGITODD') {
                return (idx % 2 === 1) ? idx : null; // return odd numbers
            }
            return barrier; // return selected number
        };

        return (
            <div
                ref={node => this.node = node}
                className='digits'
            >
                { display_array.map((idx) => (
                    <DigitDisplay
                        barrier={getBarrier(idx)}
                        is_lost={is_lost}
                        is_won={is_won}
                        key={idx}
                        latest_digit={latest_digit}
                        value={idx}
                    />
                ))}
                { latest_digit.digit >= 0 &&
                    <LastDigitPointer
                        is_lost={is_lost}
                        is_won={is_won}
                        position={position}
                    />
                }
                <LastDigitParticles
                    is_won={is_won}
                    position={position}
                />
            </div>
        );
    }
}

LastDigitPrediction.propTypes = {
    barrier      : PropTypes.number,
    contract_type: PropTypes.string,
    digits_info  : PropTypes.object,
    is_ended     : PropTypes.bool,
    status       : PropTypes.string,
};

export default observer(LastDigitPrediction);
