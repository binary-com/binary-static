import PropTypes            from 'prop-types';
import React                from 'react';
import ErrorBalance         from './error_balance.jsx';
import ErrorGeneral         from './error_general.jsx';
import ErrorLogin           from './error_login.jsx';
import PurchaseResult       from './purchase_result.jsx';
import { getPropertyValue } from '../../../../../../../_common/utility';

const MessageBox = ({ purchase_info }) => {
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
        <div className='purchase-error'>
            {has_error ?
                <React.Fragment>
                    <div className='close-btn-container'>
                        <svg className='ic-close' height='24' width='24' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/>
                            <path d='M0 0h24v24H0z' fill='none'/>
                        </svg>
                    </div>
                    {ErrorComponent}
                </React.Fragment>
                :
                <PurchaseResult purchase_info={purchase_info.buy} />
            }
        </div>
    );
};

MessageBox.propTypes = {
    purchase_info: PropTypes.object,
};

export default MessageBox;
