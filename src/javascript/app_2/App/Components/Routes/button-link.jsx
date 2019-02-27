import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Link }       from 'react-router-dom';

const ButtonLink = ({ children, className, to }) => (
    <Link
        className={classNames('btn btn--link', className, 'effect')}
        to={to}
    >
        {children}
    </Link>
);

ButtonLink.propTypes = {
    children : PropTypes.object,
    className: PropTypes.string,
    to       : PropTypes.string,
};

export default ButtonLink;
