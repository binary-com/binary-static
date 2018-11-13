import PropTypes               from 'prop-types';
import React                   from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import {
    findRouteByPath,
    normalizePath,
}                              from './helpers';
import getRoutesConfig         from '../../Constants/routes_config';

const prependLanguageAndNamespace = (match, link) => `/${match.params.lang}/${match.params.ns}${link}`;

// TODO: solve circular dependency problem
// when binary link is imported into components present in routes config
// or into their descendants
const BinaryLink = ({ to, children, ...props }) => {
    const path   = prependLanguageAndNamespace(props.match, normalizePath(to));
    const config = getRoutesConfig(props.match);

    const route = findRouteByPath(path, config);

    if (!route) {
        throw new Error(`Route not found: ${path} ${JSON.stringify(config)}`);
    }

    return (
        to ?
            <NavLink to={path} activeClassName='active' exact={route.exact} props={props}>
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

export default withRouter(BinaryLink);
