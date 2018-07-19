import React        from 'react';
import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import { localize } from '../../../../../_common/localize';

const PopConfirmElement = ({
    alignment,
    cancel_text,
    confirm_text,
    is_visible,
    message,
    onClose,
    onConfirm,
    wrapperRef,
}) => {
    const popconfirm_class = classNames('popconfirm', alignment, {
        'open': is_visible,
    });
    return (
        <div ref={wrapperRef} className={popconfirm_class}>
            <div className='popconfirm-title'>
                {/* TO-DO - Move inline svg to sprite or component with other svg once assets are finalized */}
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                    <g fill='none' fillRule='evenodd'><circle cx='8' cy='8' r='8' fill='#FFC107'/>
                        <g fill='#FFF' transform='matrix(1 0 0 -1 6.5 12)'>
                            <circle cx='1.5' cy='1' r='1'/>
                            <path d='M1.5 3c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0V4c0-.6.4-1 1-1z'/>
                        </g>
                    </g>
                </svg>
                <h4>{localize(message)}</h4>
            </div>
            <div className='popconfirm-buttons'>
                <div
                    className='btn flat effect'
                    onClick={onClose}
                >
                    <span>{localize(cancel_text)}</span>
                </div>
                <div
                    className='btn flat effect'
                    onClick={onConfirm}
                >
                    <span>{localize(confirm_text)}</span>
                </div>
            </div>
        </div>
    );
};

PopConfirmElement.propTypes = {
    alignment   : PropTypes.string,
    cancel_text : PropTypes.string,
    confirm_text: PropTypes.string,
    is_visible  : PropTypes.bool,
    message     : PropTypes.string,
    onConfirm   : PropTypes.func,
    onClose     : PropTypes.func,
    wrapperRef  : PropTypes.func,
};

export { PopConfirmElement };
