import React              from 'react';
import { Switch }         from 'react-router-dom';
import getRoutesConfig    from 'App/Constants/routes_config';
import UILoader           from 'App/Components/Elements/ui_loader.jsx';
import RouteWithSubRoutes from './route_with_sub_routes.jsx';

const BinaryRoutes = (props) => (
    <React.Suspense fallback={<UILoader />}>
        <Switch>
            {
                getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))
            }
        </Switch>
    </React.Suspense>

);

export default BinaryRoutes;
