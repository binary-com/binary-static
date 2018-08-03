import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '../../../../../_common/base/currency_base';

const MarkerSpot = ({
    align,
    icon,
    status,
    spot_value,
}) => (
    <div className={classNames('chart-spot', align, status)}>
        <div className='content'>
            {icon}
            {addComma(spot_value)}
        </div>
        <div className='arrow' />
        <div className='spot' />
    </div>
);

MarkerSpot.propTypes = {
    align     : PropTypes.oneOf(['left', 'right']),
    icon      : PropTypes.object,
    status    : PropTypes.oneOf(['won', 'lost']),
    spot_value: PropTypes.string,
};
export default observer(MarkerSpot);
