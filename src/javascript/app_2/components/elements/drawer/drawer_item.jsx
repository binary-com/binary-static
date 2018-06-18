import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from '../../../store/connect';
import { BinaryLink }           from '../../../routes';

class DrawerItem extends PureComponent {
    drawerItemClicked = () => {
        this.props.hideDrawers();
        if (this.props.collapseItems) {
            this.props.collapseItems();
        }
    }

    render() {
        const { link_to, text, icon, custom_action } = this.props;

        return (
            <div className='drawer-item' onClick={this.drawerItemClicked}>
                {custom_action ?
                    <a href='javascript:;' onClick={custom_action}>
                        <span className=
                            {icon || undefined}
                        >{text}
                        </span>
                    </a>
                :
                    <BinaryLink to={link_to}>
                        <span className={icon || undefined}>{text}</span>
                    </BinaryLink>
              }
            </div>
        );
    }
}

DrawerItem.propTypes = {
    collapseItems: PropTypes.func,
    custom_action: PropTypes.func,
    href         : PropTypes.string,
    icon         : PropTypes.string,
    text         : PropTypes.string,
    hideDrawers  : PropTypes.func,
    link_to      : PropTypes.string,
};

const drawer_item_component = connect(({ ui }) => ({
    hideDrawers: ui.hideDrawers,
}))(DrawerItem);

export { drawer_item_component as DrawerItem };
