import React                       from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import PropTypes                   from 'prop-types';
import Menu                        from './components/menu/menu.jsx';
import MobileDropdown              from './components/menu/mobile_dropdown.jsx';

import settings_data from './settings_data';

const Settings = ({ match, routes }) => {
    const component_to_path = routes.reduce((map, { component, path }) => {
        map[component.displayName || component.name] = path;
        return map;
    }, {});

    // Redirect doesn't work with relative paths
    const getAbsolutePath = (component) => {
        const path = component_to_path[component.displayName || component.name];
        const base = match.url[match.url.length - 1] === '/'
            ? match.url.slice(0, -1)
            : match.url;
        return `${base}/${path}`;
    };

    // Add paths from this.props.routes to items
    const data = settings_data.map(section => ({
        ...section,
        items: section.items.map(item => ({
            ...item,
            path: getAbsolutePath(item.Component),
        })),
    }));

    const all_items = data.reduce((all, section) => [...all, ...section.items], []);
    return (
        <div className='settings container'>
            <div className='settings__sidebar desktop-only'>
                <Menu data={data} />
            </div>
            <div className='mobile-only'>
                <MobileDropdown all_items={all_items}>
                    <Menu data={data} />
                </MobileDropdown>
            </div>
            <div className='settings__content'>
                <Switch>
                    {
                        all_items.map(({ Component, title, description, path }) => (
                            <Route
                                key={path}
                                path={path}
                                render={() => <Component title={title} description={description} />}
                            />
                        ))
                    }
                    <Redirect from={match.url} to={all_items[0].path} />
                </Switch>
            </div>
        </div>
    );
};

Settings.propTypes = {
    match : PropTypes.object,
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path     : PropTypes.string,
            component: PropTypes.function,
        })
    ),
};

export default Settings;
