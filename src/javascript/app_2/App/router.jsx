import PropTypes                  from 'prop-types';
import React                      from 'react';
import { BrowserRouter, Route }   from 'react-router-dom';
import { MobxProvider }           from 'Stores/connect';
import App                        from './app.jsx';

const Router = ({ root_store }) => (
    <MobxProvider store={root_store}>
        <BrowserRouter>
            <Route path='/:lang/:ns/' component={App} />
        </BrowserRouter>
    </MobxProvider>
);

Router.propTypes = {
    root_store: PropTypes.object,
};

export default Router;
