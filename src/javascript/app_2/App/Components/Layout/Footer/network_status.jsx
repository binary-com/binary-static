import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import Tooltip      from '../../Elements/tooltip.jsx';
import { localize } from '../../../../../_common/localize';

const NetworkStatus = ({ status }) => (
    <div className='network-status-wrapper'>
        <Tooltip alignment='top' message={localize('Network status: [_1]', [(status.tooltip || 'Connecting')])}>
            <div className={classNames('network-status-circle', status.class)} />
        </Tooltip>
    </div>
);

NetworkStatus.propTypes = {
    status: PropTypes.object,
};

export { NetworkStatus };
