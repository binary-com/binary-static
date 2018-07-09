import classNames  from 'classnames';
import PropTypes   from 'prop-types';
import React       from 'react';
import { Drawer }  from './drawer.jsx';
import { connect } from '../../../../Stores/connect';
import Url         from '../../../../../_common/url';

class ToggleDrawer extends React.Component {
    showDrawer = () => {
        const { alignment } = this.props;
        if (alignment === 'left') {
            this.props.showMainDrawer();
        } else if (alignment === 'right') {
            this.props.showNotificationsDrawer();
        }
    };

    closeDrawer = () => {
        this.props.hideDrawers();
    };

    render() {
        const { icon_class, icon_link, alignment, children } = this.props;

        const toggle_class = classNames('navbar-icons', icon_class, {
            'menu-toggle': !icon_class,
        });

        return (
            <React.Fragment>
                <div className={toggle_class} onClick={this.showDrawer}>
                    <img src={icon_link || Url.urlForStatic('images/app_2/header/menu.svg')} />
                </div>
                <Drawer
                    alignment={alignment}
                    closeBtn={this.closeDrawer}
                >
                    {children}
                </Drawer>
            </React.Fragment>
        );
    }
}

ToggleDrawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    footer                 : PropTypes.func,
    hideDrawers            : PropTypes.func,
    icon_class             : PropTypes.string,
    icon_link              : PropTypes.string,
    showMainDrawer         : PropTypes.func,
    showNotificationsDrawer: PropTypes.func,
};

const drawer_component = connect(
    ({ ui }) => ({
        showMainDrawer         : ui.showMainDrawer,
        showNotificationsDrawer: ui.showNotificationsDrawer,
        hideDrawers            : ui.hideDrawers,
    })
)(ToggleDrawer);

export { drawer_component as ToggleDrawer };
