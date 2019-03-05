import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';
import { toMoment } from 'Utils/Date';
import { IconClock }    from '../../../../Assets/Common/icon-clock.jsx';

const MarkerSpot = ({
    icon,
    spot_epoch,
    spot_value,
    spot_count,
    spot_className,
    status,
}) => (
    <div className={classNames('chart-spot', `chart-spot--${status}`)}>
        { icon &&
            <React.Fragment>
                <div className='chart-spot__icon-container'>
                    <div className='chart-spot__icon'>{icon}</div>
                </div>
            </React.Fragment>
        }
        <div className='chart-spot__time-container'>
            <IconClock height='10' width='10' className='chart-spot__time-icon' />
            <div className='chart-spot__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</div>
        </div>
        <div className='chart-spot__content-box'>
            {/* {icon} */}
            {addComma(spot_value)}
        </div>
        {/* <div className='chart-spot__arrow' /> */}
        <div className={spot_className}>5</div>
    </div>
);

MarkerSpot.propTypes = {
    icon      : PropTypes.object,
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
