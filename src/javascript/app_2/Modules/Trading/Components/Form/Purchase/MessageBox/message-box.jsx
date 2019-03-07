import PropTypes            from 'prop-types';
import React                from 'react';
import { getPropertyValue } from '_common/utility';
import {
    Icon,
    IconClose }             from 'Assets/Common';
import PurchaseResult       from './purchase-result.jsx';
import {
    ErrorBalance,
    ErrorGeneral,
    ErrorLogin }            from './Templates';

const MessageBox = ({ currency, purchase_info, onClick }) => {
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
        <div className='purchase-container__error'>
            <div className='purchase-container__error-close-btn' onClick={onClick}>
                <Icon icon={IconClose} className='purchase-container__error-close-btn-ic' />
            </div>
            {has_error ?
                ErrorComponent
                :
                <PurchaseResult
                    purchase_info={purchase_info.buy}
                    currency={currency}
                />
            }
        </div>
    );
};

MessageBox.propTypes = {
    currency     : PropTypes.string,
    onClick      : PropTypes.func,
    purchase_info: PropTypes.object,
};

export default MessageBox;
