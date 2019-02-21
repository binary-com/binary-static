import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from '_common/localize';
import { IconClose } from 'Assets/Common';

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
                        <IconClose />
                    </div>
                    <div className='notifications-header'>
                        <h4>{localize('all notifications')}</h4>
                    </div>
                </div>
                :
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <IconClose />
                    </div>
                    <div className='icons brand-logo'>
                        <div className='img' />
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
