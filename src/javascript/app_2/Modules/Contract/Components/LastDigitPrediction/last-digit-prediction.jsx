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
        const { digits_info, is_ended } = this.props;
        const digits_array = Object.keys(digits_info).sort().map(spot_time => digits_info[spot_time]);
        const latest_digit = digits_array.slice(-1)[0] || {};
        const { is_win } = latest_digit;

        const is_won  = is_ended && is_win;
        // need to explicitly have is_loss condition here
        // because negating is_won would always be true,
        // but we only need is_loss condition only once we have the is_win result
        const is_loss = is_ended && !is_win;

        const position = this.state[latest_digit.digit];
        return (
            <div
                ref={node => this.node = node}
                className='digits'
            >
                { display_array.map((idx) => (
                    <DigitDisplay
                        digit_value={idx}
                        is_ended={is_ended}
                        key={idx}
                        latest_digit={latest_digit}
                        selected_digit={+this.props.contract_info.barrier}
                    />
                ))}
                { latest_digit.digit >= 0 &&
                    <LastDigitPointer
                        is_loss={is_loss}
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
    digits_info: PropTypes.object,
    is_ended   : PropTypes.bool,
};

export default observer(LastDigitPrediction);
