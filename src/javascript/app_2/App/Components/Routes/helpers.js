import { matchPath } from 'react-router';

export const normalizePath = (path) => /^\//.test(path) ? path : `/${path || ''}`; // Default to '/'

export const findRouteByPath = (path, routes_config) => {
    let result;

    routes_config.some((route_info) => {
        if (matchPath(path, route_info)) {
            result = route_info;
            return true;
        } else if (route_info.routes) {
            result = findRouteByPath(path, route_info.routes);
            return result;
        }
        return false;
    });

    return result;
};

export const isRouteVisible = (route, is_logged_in) =>
    !(route && route.is_authenticated && !is_logged_in);
