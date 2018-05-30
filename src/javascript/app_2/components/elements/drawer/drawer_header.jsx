import React          from 'react';
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import Url            from '../../../../_common/url';

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
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                </div>
            :
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                    <div className='icons brand-logo'>
                        <img src={Url.urlForStatic('images/trading_app/header/binary_logo_dark.svg')} alt='Binary.com' />
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
