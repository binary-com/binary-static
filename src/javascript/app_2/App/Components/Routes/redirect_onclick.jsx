import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router-dom';

const RedirectOnClick = ({
    children,
    className,
    history,
    path,
}) => (
    <div className={className} onClick={path ? () => { history.push(path); } : null}>
        {children}
    </div>
);

RedirectOnClick.propTypes = {
    children : PropTypes.any,
    className: PropTypes.string,
    history  : PropTypes.object,
    path     : PropTypes.string,
};

export default withRouter(RedirectOnClick);
