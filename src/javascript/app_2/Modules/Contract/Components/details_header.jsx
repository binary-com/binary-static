import classNames        from 'classnames';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { header_config } from '../../../Stores/Modules/Contract/Constants/ui';
import { localize }      from '../../../../_common/localize';

const DetailsHeader = ({ status }) => {
    const title_purchased = localize(header_config.purchased.title);
    const title_result = localize(header_config[status].title);
    const icon_purchased  = header_config.purchased.icon;
    const icon_result  = header_config[status].icon;
    return (
        <div className={classNames('contract-header', status)}>
            <div className='header-wrapper'>
                <div className='header-result'>
                    {icon_result}
                    {title_result}
                </div>
                <div className='header-purchased'>
                    {icon_purchased}
                    {title_purchased}
                </div>
            </div>
        </div>
    );
};

DetailsHeader.propTypes = {
    status: PropTypes.oneOf(['purchased', 'won', 'lost']),
};

export default observer(DetailsHeader);
