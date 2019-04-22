import React                       from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Icon }                    from 'Assets/Common';
import routes                      from 'Constants/routes';

class VerticalTabContentContainer extends React.PureComponent {
    render() {
        const selected   = this.props.items.find(item => item.label === this.props.selected.label);
        const TabContent = selected.value;

        return (
            <div className='vertical-tab__content'>
                { this.props.action_bar &&
                    <div className='vertical-tab__action-bar'>
                        {
                            this.props.action_bar.map(({ icon, onClick, title }) => (
                                <Icon className='vertical-tab__action-bar--icon' key={title} icon={icon} onClick={onClick} />
                            ))
                        }
                    </div>
                }
                { this.props.is_routed ?
                    <Switch>
                        <Redirect exact from={routes.reports} to={routes.positions} />
                        {
                            this.props.items.map(({ value, path }) => {
                                const Component = value;
                                return (
                                    <Route
                                        key={path}
                                        path={path}
                                        render={() => <Component />}
                                    />
                                );
                            })
                        }
                    </Switch>
                    :
                    <TabContent
                        key={selected.label}
                        className='item-id'
                    />
                }
            </div>
        );
    }
}

export { VerticalTabContentContainer };
