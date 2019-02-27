import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { addComma } from '_common/base/currency_base';

const MarkerSpot = ({
    align,
    has_icon = true,
    className,
    icon,
    spot_value,
    status,
}) => (
    <div className={classNames('chart-spot', align, status)}>
        {has_icon &&
            <React.Fragment>
                <div className='content'>
                    {icon}
                    {addComma(spot_value)}
                </div>
                <div className='arrow' />
            </React.Fragment>
        }
        <div className={classNames('spot', className)} />
    </div>
);

MarkerSpot.propTypes = {
    align     : PropTypes.oneOf(['left', 'right']),
    icon      : PropTypes.object,
    spot_value: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpot);
