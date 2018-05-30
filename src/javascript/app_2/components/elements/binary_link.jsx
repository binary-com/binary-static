import React        from 'react';
import { NavLink }  from 'react-router-dom';
import PropTypes    from 'prop-types';
import TradeApp     from '../../pages/trading/trade_app.jsx';
import Statement    from '../../pages/statement/statement.jsx';
import LostPassword from '../../pages/account/lost_password.jsx';

const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/statement', component: Statement, is_authenticated: true },
    { path: '/account',   component: LostPassword, is_authenticated: false },
];

export const BinaryLink = ({ to, children, ...props }) => {
    const path = /^\//.test(to) ? to : `/${to || ''}`; // Default to '/'
    const route = routes.find(r => r.path === path);
    if (to && route) {
        return (
            <NavLink to={path} activeClassName='active' exact={route.exact} {...props}>
                {children}
            </NavLink>
        );
    } else if (!to) {
        return (
            <a href='javascript:;' {...props}>
                {children}
            </a>
        );
    }
    // else
    throw new Error(`Route not found: ${to}`);
};

BinaryLink.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    to: PropTypes.string,
};
