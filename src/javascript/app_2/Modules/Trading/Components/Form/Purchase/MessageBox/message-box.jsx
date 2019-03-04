import PropTypes            from 'prop-types';
import React                from 'react';
import { getPropertyValue } from '_common/utility';
import { IconClose }        from 'Assets/Common/icon-close.jsx';
import {
    ErrorBalance,
    ErrorGeneral,
    ErrorLogin }            from './Templates';

const MessageBox = ({ purchase_info, onClick }) => {
    const has_error = !!purchase_info.error;
    let ErrorComponent;
    if (has_error) {
        const error_code = getPropertyValue(purchase_info, ['error', 'code']);
        switch (error_code) {
            case 'AuthorizationRequired':
                ErrorComponent = <ErrorLogin />;
                break;
            case 'InsufficientBalance':
                ErrorComponent = <ErrorBalance />;
                break;
            default:
                ErrorComponent = <ErrorGeneral message={purchase_info.error.message} />;
                break;
        }
    }

    return (
        <div className='message-box'>
            <div className='message-box__close-btn' onClick={onClick}>
                <IconClose className='ic-close' />
            </div>
            {ErrorComponent}
        </div>
    );
};

MessageBox.propTypes = {
    currency     : PropTypes.string,
    onClick      : PropTypes.func,
    purchase_info: PropTypes.object,
};

export default MessageBox;
