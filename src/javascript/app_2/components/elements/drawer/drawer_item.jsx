import React, { PureComponent } from 'react';
import PropTypes      from 'prop-types';
import { connect }    from '../../../store/connect';
import { BinaryLink } from '../../../routes';

class DrawerItem extends PureComponent {

    drawerItemClicked = () => {
        this.props.hideDrawers();
    }

    render() {
        return (
            <div className='drawer-item' onClick={()=>this.drawerItemClicked()}>
                <BinaryLink to={this.props.link_to}>
                    <span className={this.props.icon || undefined}>{this.props.text}</span>
                </BinaryLink>
            </div>
        );
    }
    // <a href={this.props.href || 'javascript:;' }>
    //     <span className={this.props.icon || undefined}>{this.props.text}</span>
    // </a>
}

DrawerItem.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
};

const drawer_item_component = connect(
    ({ ui: {
        is_main_drawer_on, toggleMainDrawer, hideDrawers
    }}) => ({
        is_main_drawer_on, toggleMainDrawer, hideDrawers
    })
)(DrawerItem);

export { drawer_item_component as DrawerItem };
