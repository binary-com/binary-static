import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';
import { toMoment } from 'Utils/Date';
import { IconClock }    from '../../../../Assets/Common/icon-clock.jsx';

const MarkerSpot = ({
    spot_epoch,
    spot_value,
    spot_count,
    spot_className,
    status,
}) => (
    <div className={classNames('chart-spot', `chart-spot--${status}`)}>
        <div className='chart-spot__info-container'>
            <div className='chart-spot__time-container'>
                <IconClock height='10' width='10' className='chart-spot__time-icon' />
                <p className='chart-spot__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</p>
            </div>
            <div className='chart-spot__value-box'>
                <p>{addComma(spot_value)}</p>
            </div>
        </div>
        <div className={spot_className}>{spot_count}</div>
    </div>
);

MarkerSpot.propTypes = {
    icon      : PropTypes.object,
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
