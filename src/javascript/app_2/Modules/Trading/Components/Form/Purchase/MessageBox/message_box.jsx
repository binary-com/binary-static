import PropTypes            from 'prop-types';
import React                from 'react';
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
            default:
                ErrorComponent = <ErrorGeneral message={purchase_info.error.message} />;
                break;
        }
    }

    return (
        <div className='purchase-error'>
            {has_error ?
                ErrorComponent
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
