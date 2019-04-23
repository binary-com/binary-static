import React          from 'react';
import { withRouter } from 'react-router-dom';
import VerticalTab    from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import { IconClose }  from 'Assets/Settings';
import routes         from 'Constants/routes';
import { connect }    from 'Stores/connect';
import { localize }   from '_common/localize';

class Reports extends React.Component {
    menu_options = () => {
        const options = [];

        this.props.routes.forEach(route => {
            options.push({
                default: route.default,
                icon   : route.icon_component,
                label  : route.title,
                value  : route.component,
                path   : route.path,
            });
        });

        return options;
    };

    action_bar_items = [
        {
            onClick: () => { this.props.history.push(routes.trade); },
            icon   : IconClose,
            title  : localize('Close'),
        },
    ];

    render() {
        return (
            <div className='reports'>
                <VerticalTab
                    header_title={localize('Reports')}
                    action_bar={this.action_bar_items}
                    alignment='center'
                    classNameHeader='reports__tab-header'
                    current_path={this.props.location.pathname}
                    is_routed={true}
                    is_full_width={true}
                    list={this.menu_options()}
                />
            </div>
        );
    }
}

export default connect(
    ({ ui }) => ({
        is_mobile: ui.is_mobile,
    })
)(withRouter(Reports));
