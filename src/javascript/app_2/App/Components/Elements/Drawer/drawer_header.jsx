import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import Url          from '../../../../../_common/url';
import { localize } from '../../../../../_common/localize';

export const DrawerHeader = ({
    alignment,
    closeBtn,
}) => {
    const drawer_header_class = classNames('drawer-header', alignment);
    return (
        <React.Fragment>
            {alignment && alignment === 'right' ?
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <img src={Url.urlForStatic('images/app_2/common/close.svg')} alt='Close' />
                    </div>
                    <div className='notifications-header'>
                        <h4>{localize('all notifications')}</h4>
                    </div>
                </div>
            :
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <img src={Url.urlForStatic('images/app_2/common/close.svg')} alt='Close' />
                    </div>
                    <div className='icons brand-logo'>
                        <img src={Url.urlForStatic('images/app_2/header/binary_logo_dark.svg')} alt='Binary.com' />
                    </div>
                </div>
        }
        </React.Fragment>
    );
};

DrawerHeader.propTypes = {
    alignment: PropTypes.string,
    closeBtn : PropTypes.func,
};
