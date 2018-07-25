import PropTypes     from 'prop-types';
import React         from 'react';
import { NavLink }   from 'react-router-dom';
import {
    normalizePath,
    getRouteInfo }   from './helpers';
import routes_config from '../../Constants/routes_config';


const BinaryLink = ({ to, children, ...props }) => {
    const path  = normalizePath(to);
    const route = getRouteInfo(routes_config, path);

    if (!route) {
        throw new Error(`Route not found: ${to}`);
    }

    return (
        to ?
            <NavLink to={path} activeClassName='active' exact={route.exact} {...props}>
                {children}
            </NavLink>
        :
            <a href='javascript:;' {...props}>
                {children}
            </a>
    );
};

BinaryLink.propTypes = {
    children: PropTypes.object,
    to      : PropTypes.string,
};

export default BinaryLink;
