import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes     from 'prop-types';
import React        from 'react';

const MarkerSpot = ({
    className,
    spot_count,
    status,
}) => (
    <div
        className={classNames('chart-spot', className, {
            'chart-spot__spot--won' : status === 'won',
            'chart-spot__spot--lost': status === 'lost',
        })}
    >{spot_count}
    </div>
);

MarkerSpot.propTypes = {
    className : PropTypes.string,
    spot_count: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    status    : PropTypes.oneOf(['won', 'lost']),
};

export default observer(MarkerSpot);
