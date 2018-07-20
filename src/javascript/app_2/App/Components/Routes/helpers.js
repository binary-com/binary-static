
export const normalizePath = (path) => /^\//.test(path) ? path : `/${path || ''}`; // Default to '/'

export const getRouteInfo = (routes, path) => routes.find(r => r.path === normalizePath(path));

export const isRouteVisible = (route, is_logged_in) =>
    !(route && route.is_authenticated && !is_logged_in);

