import { observer }  from 'mobx-react';
import PropTypes     from 'prop-types';
import React         from 'react';
import { addComma }  from '_common/base/currency_base';
import { toMoment }  from 'Utils/Date';
import MarkerSpot    from './marker-spot.jsx';
import { IconClock } from '../../../../Assets/Common/icon-clock.jsx';

class MarkerSpotLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: !this.props.has_hover_toggle,
        };
    }

    handleHoverToggle = () => {
        this.setState((state) =>  ({ isShow: !state.isShow }));
    }

    render() {
        let spot = <MarkerSpot
            className={this.props.spot_className}
            spot_count={this.props.spot_count}
            status={this.props.status}
        />;

        if (this.props.has_hover_toggle) {
            spot = <div onMouseEnter={this.handleHoverToggle} onMouseLeave={this.handleHoverToggle}>{ spot }</div>;
        }

        return (
            <div className={'chart-spot-label'}>
                {this.state.isShow &&
                    <div className='chart-spot-label__info-container'>
                        <div className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${this.props.align_label}`}>
                            <div className='chart-spot-label__time-container'>
                                <IconClock height='10' width='10' className='chart-spot-label__time-icon' />
                                <p className='chart-spot-label__time'>{toMoment(+this.props.spot_epoch).format('HH:mm:ss')}</p>
                            </div>
                            <div className='chart-spot-label__value-container'>
                                <p>{addComma(this.props.spot_value)}</p>
                            </div>
                        </div>
                    </div>
                }
                { spot }
            </div>);
    }
}

MarkerSpotLabel.defaultProps = {
    align_label: 'top',
};

MarkerSpotLabel.propTypes = {
    align_label     : PropTypes.oneOf(['top', 'bottom']),
    has_hover_toggle: PropTypes.bool,
    spot_className  : PropTypes.string,
    spot_count      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_epoch      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_value      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    status          : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpotLabel);
