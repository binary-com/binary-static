import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuList from './components/menu_list.jsx';
import { data } from './settings_data';

const Settings = ({ match, routes }) => {
    const component_to_path = routes.reduce((map, { component, path }) => {
        map[component.displayName || component.name] = path;
        return map;
    }, {});

    const all_items = data.reduce((all, section) => [...all, ...section.items], []);

    const getFullPath = (component) => {
        const path = component_to_path[component.displayName || component.name];
        const base = match.url[match.url.length - 1] === '/'
            ? match.url.slice(0, -1)
            : match.url;
        return `${base}${path}`;
    };

    return (
        <div className='settings container'>
            <div className='settings__sidebar'>
                {
                    data.map(section =>
                        <div key={section.title}>
                            <h2 className='settings__section_header'>{section.title}</h2>
                            <hr className='settings__separator'/>
                            <MenuList
                                items={
                                    section.items.map(
                                        item => (
                                            { ...item, path: getFullPath(item.Component) }
                                        )
                                    )
                                }
                            />
                        </div>
                    )
                }
            </div>
            <div className='settings__content'>
                <Switch>
                    {
                        all_items.map(({ Component, title, content }, i) => (
                            <Route
                                key={i}
                                path={getFullPath(Component)}
                                render={() => <Component title={title} content={content} />}
                            />
                        ))
                    }
                    <Redirect from={match.url} to={getFullPath(all_items[0].Component)} />
                </Switch>
            </div>
        </div>
    );
};

Settings.propTypes = {
    match   : PropTypes.object,
    sections: PropTypes.array,
    routes  : PropTypes.array,
};

export default Settings;
