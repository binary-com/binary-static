import React              from 'react';
import RouteWithSubRoutes from './route_with_sub_routes';
import getRoutesConfig    from '../../Constants/routes_config';


const BinaryRoutes = () => getRoutesConfig().map((route, idx) => (
    <RouteWithSubRoutes key={idx} {...route} />
));

export default BinaryRoutes;
