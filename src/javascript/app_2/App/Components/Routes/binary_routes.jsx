import React                  from 'react';
import { Switch, withRouter } from 'react-router-dom';
import RouteWithSubRoutes     from './route_with_sub_routes.jsx';
import getRoutesConfig        from '../../Constants/routes_config';

const BinaryRoutes = (props) => (
    <Switch>
        {
            getRoutesConfig(props.match).map((route, idx) => (
                <RouteWithSubRoutes key={idx} {...route} />
            ))
        }
    </Switch>
);

export default withRouter(BinaryRoutes);
