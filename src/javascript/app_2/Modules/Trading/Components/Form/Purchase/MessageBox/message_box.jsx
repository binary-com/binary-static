import PropTypes            from 'prop-types';
import React                from 'react';
import ErrorBalance         from './error_balance.jsx';
import ErrorGeneral         from './error_general.jsx';
import ErrorLogin           from './error_login.jsx';
import PurchaseResult       from './purchase_result.jsx';
import { getPropertyValue } from '../../../../../../../_common/utility';
import CloseButton          from '../../../../../../App/Components/Elements/closebutton.jsx';

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
        <div className='purchase-error'>
            {has_error ?
                <React.Fragment>
                    <div className='close-btn-container' onClick={onClick}>
                        <CloseButton className='ic-close' />
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
    onClick      : PropTypes.func,
};

export default MessageBox;
