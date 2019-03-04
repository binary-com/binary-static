import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';

const MarkerSpot = ({
    align,
    icon,
    spot_value,
    status,
}) => (
    <div className={classNames('chart-spot', `chart-spot--${align}`, `chart-spot--${status}`)}>
        <div className='chart-spot__content'>
            {icon}
            {addComma(spot_value)}
        </div>
        <div className='chart-spot__arrow' />
        <div className='chart-spot__spot' />
    </div>
);

MarkerSpot.propTypes = {
    align     : PropTypes.oneOf(['left', 'right']),
    icon      : PropTypes.object,
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
