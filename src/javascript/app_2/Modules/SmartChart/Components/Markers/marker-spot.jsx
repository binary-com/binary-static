import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';
import { toMoment } from 'Utils/Date';
import { IconClock }    from '../../../../Assets/Common/icon-clock.jsx';

const MarkerSpot = ({
    align = 'top',
    spot_className,
    spot_count,
    spot_epoch,
    spot_value,
    status,
}) => (
    <div className={'chart-spot'}>
        <div className={`chart-spot__info-container chart-spot__time-container--${align}`}>
            <div className='chart-spot__time-container'>
                <IconClock height='10' width='10' className='chart-spot__time-icon' />
                <p className='chart-spot__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</p>
            </div>
            <div className='chart-spot__value-container'>
                <p>{addComma(spot_value)}</p>
            </div>
        </div>
        <div
            className={classNames(spot_className, {
                'chart-spot__spot--won' : status === 'won',
                'chart-spot__spot--lost': status === 'lost',
            })}
        >{spot_count}
        </div>
    </div>
);

MarkerSpot.propTypes = {
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
