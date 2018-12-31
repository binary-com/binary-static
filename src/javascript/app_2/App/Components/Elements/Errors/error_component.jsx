import PropTypes    from 'prop-types';
import React        from 'react';
import IconError    from 'Assets/Common/icon_error.jsx';
import { localize } from '_common/localize';
import Localize     from '../localize.jsx';

const ErrorComponent = ({ type, message }) => {
    let msg = '';
    if (typeof message === 'object') {
        msg = <Localize
            str={message.str}
            replacers={message.replacers}
        />;
    } else {
        msg = message;
    }
    return (
        <div className='error-container'>
            <IconError type={type} />
            <p>{msg || localize('Sorry, an error occured while processing your request.')}</p>
        </div>
    );
};

ErrorComponent.propTypes = {
    message: PropTypes.oneOfType([
        PropTypes.shape({
            replacers: PropTypes.object,
            str      : PropTypes.string,
        }),
        PropTypes.string,
    ]),
    type: PropTypes.string,
};

export default ErrorComponent;
