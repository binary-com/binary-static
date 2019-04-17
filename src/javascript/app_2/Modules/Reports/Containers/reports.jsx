import React                 from 'react';
import { withRouter }        from 'react-router-dom';
import VerticalTab           from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import { connect }           from 'Stores/connect';

class Reports extends React.Component {
    menu_options = () => {
        const options = [];

        this.props.routes.forEach(route => {
            options.push({
                icon : route.icon_component,
                label: route.title,
                value: route.component,
                path : route.path,
            });
        });

        return options;
    };

    render() {
        return (
            <div className='reports'>
                <VerticalTab
                    alignment='center'
                    classNameHeader='reports__tab-header'
                    is_routed={true}
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
