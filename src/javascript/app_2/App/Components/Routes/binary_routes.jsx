import React              from 'react';
import UILoader           from 'App/Components/Elements/ui_loader.jsx';
import RouteWithSubRoutes from './route_with_sub_routes.jsx';
import getRoutesConfig    from '../../Constants/routes_config';

const BinaryRoutes = () => (
    <React.Suspense fallback={<UILoader />}>
        {
            getRoutesConfig().map((route, idx) => (
                <RouteWithSubRoutes key={idx} {...route} />
            ))
        }
    </React.Suspense>
);

export default BinaryRoutes;
