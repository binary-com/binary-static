import React              from 'react';
import RouteWithSubRoutes from './route_with_sub_routes.jsx';
import routes_config      from '../../Constants/routes_config';


const BinaryRoutes = () => routes_config.map((route, idx) => (
    <RouteWithSubRoutes key={idx} {...route} />
));

export default BinaryRoutes;
