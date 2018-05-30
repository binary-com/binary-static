import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from '../../../store/connect';
import { BinaryLink }           from '../binary_link.jsx';

class DrawerItem extends PureComponent {
    drawerItemClicked = () => {
        this.props.hideDrawers();
    }

    render() {
        const { link_to, text, icon } = this.props;
        return (
            <div className='drawer-item' onClick={()=>this.drawerItemClicked()}>
                <BinaryLink to={link_to}>
                    <span className={icon || undefined}>{text}</span>
                </BinaryLink>
            </div>
        );
    }
}

DrawerItem.propTypes = {
    href       : PropTypes.string,
    icon       : PropTypes.string,
    text       : PropTypes.string,
    hideDrawers: PropTypes.func,
    link_to    : PropTypes.string,
};

const drawer_item_component = connect(({ ui: { hideDrawers }}) => ({
    hideDrawers,
}))(DrawerItem);

export { drawer_item_component as DrawerItem };
