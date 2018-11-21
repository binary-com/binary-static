import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { withRouter }                 from 'react-router';
import { connect }                    from 'Stores/connect';
import ErrorComponent                 from '../../Components/Elements/Errors';
import BinaryRoutes                   from '../../Components/Routes';

const Routes = (props) => {
    if (props.has_error) {
        return <ErrorComponent {...props.error} />;
    }

    return <BinaryRoutes is_logged_in={props.is_logged_in} />;
};

Routes.propTypes = {
    error       : MobxPropTypes.objectOrObservableObject,
    has_error   : PropTypes.bool,
    is_logged_in: PropTypes.bool,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(connect(
    ({ common, client }) => ({
        error       : common.error,
        has_error   : common.has_error,
        is_logged_in: client.is_logged_in,
    }),
)(Routes));
