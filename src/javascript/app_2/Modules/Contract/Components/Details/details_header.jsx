import classNames        from 'classnames';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { header_config } from '../../../../Stores/Modules/Contract/Constants/ui';
import { localize }      from '../../../../../_common/localize';

const DetailsHeader = ({ status }) => {
    const className = classNames('contract-header', status);
    const title     = localize(header_config[status].title);
    const icon      = header_config[status].icon;

    return (
        <div className={className}>
            {icon}
            {title}
        </div>
    );
};

DetailsHeader.propTypes = {
    status: PropTypes.oneOf(['purchased', 'won', 'lost']),
};

export default observer(DetailsHeader);
