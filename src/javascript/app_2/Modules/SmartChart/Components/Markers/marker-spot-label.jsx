import { observer }  from 'mobx-react';
import PropTypes     from 'prop-types';
import React         from 'react';
import { addComma }  from '_common/base/currency_base';
import { toMoment }  from 'Utils/Date';
import MarkerSpot    from './marker-spot.jsx';
import { IconClock } from '../../../../Assets/Common/icon-clock.jsx';

const MarkerSpotLabel = ({
    align_label = 'top',
    spot_className,
    spot_count,
    spot_epoch,
    spot_value,
    status,
}) => (
    <div className={'chart-spot-label'}>
        <div className='chart-spot-label__info-container'>
            <div className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${align_label}`}>
                <div className='chart-spot-label__time-container'>
                    <IconClock height='10' width='10' className='chart-spot-label__time-icon' />
                    <p className='chart-spot-label__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</p>
                </div>
                <div className='chart-spot-label__value-container'>
                    <p>{addComma(spot_value)}</p>
                </div>
            </div>
        </div>
        <MarkerSpot
            className={spot_className}
            spot_count={spot_count}
            status={status}
        />
    </div>
);

MarkerSpotLabel.propTypes = {
    align_label   : PropTypes.oneOf(['top', 'bottom']),
    spot_className: PropTypes.string,
    spot_count    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_epoch    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_value    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    status        : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpotLabel);
