import React              from 'react';
import getRoutesConfig    from 'App/Constants/routes_config';
import RouteWithSubRoutes from './route_with_sub_routes.jsx';

const BinaryRoutes = (props) => getRoutesConfig().map((route, idx) => (
    <RouteWithSubRoutes key={idx} {...route} {...props} />
));

export default BinaryRoutes;
