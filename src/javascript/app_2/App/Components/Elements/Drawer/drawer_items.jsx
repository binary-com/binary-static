import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { DrawerItem } from './drawer_item.jsx';

class DrawerItems extends React.Component {
    state = { is_collapsed: false };

    collapseItems = () => {
        this.setState({
            is_collapsed: !this.state.is_collapsed,
        });
    };

    render() {
        const { is_collapsed } = this.state;
        const { text, items } = this.props;

        const list_is_collapsed = {
            visibility: is_collapsed ? 'visible' : 'hidden',
        };
        const parent_item_class = classNames('parent-item', {
            'show': is_collapsed,
        });
        const drawer_items_class = classNames('drawer-items', {
            'show': is_collapsed,
        });
        return (
            <React.Fragment>
                <div className='drawer-item' onClick={this.collapseItems}>
                    <span className={parent_item_class}>{text}</span>
                </div>
                <div
                    className={drawer_items_class}
                    style={list_is_collapsed}
                >
                    <div className='items-group'>
                        {items.map((item, idx) => (
                            <DrawerItem key={idx} {...item} collapseItems={this.collapseItems}/>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

DrawerItems.propTypes = {
    items: PropTypes.array,
    text : PropTypes.string,
};

export { DrawerItems };
