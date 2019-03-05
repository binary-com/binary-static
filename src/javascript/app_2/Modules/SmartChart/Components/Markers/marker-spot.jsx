import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';
import { toMoment }    from 'Utils/Date';

const MarkerSpot = ({
    icon,
    spot_epoch,
    spot_value,
    status,
}) => (
    <div className={classNames('chart-spot', `chart-spot--${status}`)}>
        <div className='chart-spot__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</div>
        <div className='chart-spot__content-box'>
            {/* {icon} */}
            {addComma(spot_value)}
        </div>
        {/* <div className='chart-spot__arrow' /> */}
        <div className='chart-spot__spot' />
    </div>
);

MarkerSpot.propTypes = {
    icon      : PropTypes.object,
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
