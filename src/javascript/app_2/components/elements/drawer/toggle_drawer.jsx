import React, { PureComponent } from 'react';
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import Drawer         from './drawer';
import Url            from '../../../../_common/url';

class ToggleDrawer extends React.PureComponent {

    setRef = (node) =>  {
        this.ref = node;
    }

    showDrawer = () => {
        this.ref.show();
    }

    closeDrawer = () => {
        this.ref.hide();
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

ToggleDrawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    footer    : PropTypes.func,
    icon_class: PropTypes.string,
    icon_link : PropTypes.string,
};

export { ToggleDrawer };
