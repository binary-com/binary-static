import React, { PureComponent } from 'react';
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import { Drawer }         from './drawer';
import Url            from '../../../../_common/url';
import { connect }    from '../../../store/connect';

class ToggleDrawer extends React.PureComponent {

    setRef = (node) =>  {
        this.ref = node;
    }

    showDrawer = () => {
        console.log('toggle_drawer:show_drawer');
        this.props.showMainDrawer();
        console.log(this.props.is_main_drawer_on);
        // this.ref.show();
        // this.props.togglePortfolioDrawer;
        // console.log(this.props);
    }

    closeDrawer = () => {
        console.log('toggle_drawer:closeDrawer');
        this.props.hideMainDrawer();
        // this.ref.hide();
        // this.props.togglePortfolioDrawer;
    }

    render() {
        const toggle_class = classNames('navbar-icons', this.props.icon_class, {
            'menu-toggle': !this.props.icon_class,
        });

        return (
            <React.Fragment>
                <div className={toggle_class} onClick={this.showDrawer}>
                    {this.props.icon_link ?
                        <img src={this.props.icon_link} />
                    :
                        <img src={Url.urlForStatic('images/trading_app/header/menu.svg')} />
                    }
                </div>
                <Drawer
                    ref={this.setRef}
                    alignment={this.props.alignment}
                    closeBtn={this.closeDrawer}
                    footer={this.props.footer}
                >
                    {this.props.children}
                </Drawer>
            </React.Fragment>
        );
    }
}

const drawer_component = connect(
    ({ ui: {
        is_main_drawer_on, toggleMainDrawer, showMainDrawer, hideMainDrawer,
    } }) => ({
        is_main_drawer_on, toggleMainDrawer, showMainDrawer, hideMainDrawer,
    })
)(ToggleDrawer);

export { drawer_component as ToggleDrawer };
