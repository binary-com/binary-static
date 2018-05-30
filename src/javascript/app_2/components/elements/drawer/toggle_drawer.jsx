import React, { PureComponent } from 'react';
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import { Drawer }         from './drawer';
import Url            from '../../../../_common/url';
import { connect }    from '../../../store/connect';

class ToggleDrawer extends React.PureComponent {

    showDrawer = () => {
        let { alignment } = this.props;
        if(alignment && alignment == "left") {
            console.log('CLICKED LEFT')
            this.props.showMainDrawer();
        } else if(alignment && alignment == "right"){
            console.log('CLICKED RIGHT');
            this.props.showPortfolioDrawer();
        }
    }

    closeDrawer = () => {
        console.log('toggle_drawer:closeDrawer');
        this.props.hideDrawers();
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
        showMainDrawer, hideDrawers, showPortfolioDrawer,
    } }) => ({
        showMainDrawer, hideDrawers, showPortfolioDrawer,
    })
)(ToggleDrawer);

export { drawer_component as ToggleDrawer };
