import React from 'react';
import classNames from 'classnames';
import Url from '../../../../../_common/url';

class ToggleDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.setRef      = this.setRef.bind(this);
        this.showDrawer  = this.showDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    setRef(node) {
        this.ref = node;
    }

    showDrawer() {
        this.ref.show();
    }

    closeDrawer() {
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
                    has_footer={this.props.has_footer}
                >
                    {this.props.children}
                </Drawer>
            </React.Fragment>
        );
    }
}

class Drawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_drawer_visible: false,
        };
        this.setRef = this.setRef.bind(this);
        this.show   = this.show.bind(this);
        this.hide   = this.hide.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setRef(node) {
        this.ref = node;
    }

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    show() {
        this.setState({ is_drawer_visible: true });
        this.scrollToggle(true);
    }

    hide() {
        this.setState({ is_drawer_visible: false });
        this.scrollToggle(false);
    }

    handleClickOutside(event) {
        event.stopPropagation();
        if (this.ref && !this.ref.contains(event.target)) {
            this.hide();
        }
    }

    render() {
        const visibility = {
            visibility: `${!this.state.is_drawer_visible ? 'hidden' : 'visible'}`,
        };
        const drawer_bg_class = classNames('drawer-bg', {
            'show': this.state.is_drawer_visible,
        });
        const drawer_class = classNames('drawer', {
            'visible': this.state.is_drawer_visible,
        }, this.props.alignment);
        return (
            <aside className='drawer-container'>
                <div
                    className={drawer_bg_class}
                    style={visibility}
                    onClick={this.handleClickOutside}
                >
                    <div
                        ref={this.setRef}
                        className={drawer_class}
                        style={visibility}
                    >
                        <DrawerHeader
                            alignment={this.props.alignment}
                            closeBtn={this.props.closeBtn}
                        />
                        {this.props.children}
                        {this.props.has_footer ?
                            <div className='drawer-footer' />
                        :
                            null
                        }
                    </div>
                </div>
            </aside>
        );
    }
}

class DrawerItems extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_collapsed: false,
        };
        this.collapseItems = this.collapseItems.bind(this);
    }

    collapseItems() {
        this.setState({
            is_collapsed: !this.state.is_collapsed,
        });
    }

    render() {
        const list_is_collapsed = {
            visibility: `${this.state.is_collapsed ? 'visible' : 'hidden'}`,
        };
        const parent_item_class = classNames('parent-item', {
            'show': this.state.is_collapsed,
        });
        const drawer_items_class = classNames('drawer-items', {
            'show': this.state.is_collapsed,
        });
        return (
            <React.Fragment>
                <div className='drawer-item' onClick={this.collapseItems}>
                    <span className={parent_item_class}>{this.props.text}</span>
                </div>
                <div
                    className={drawer_items_class}
                    style={list_is_collapsed}
                >
                    <div className='items-group'>
                        {this.props.items.map((item, idx) => (
                            <div className='drawer-item' key={idx}>
                                <a href={item.href || 'javascript:;' }>
                                    <span className={item.icon || undefined}>{item.text}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class DrawerItem extends React.PureComponent {
    render() {
        return (
            <div className='drawer-item'>
                <a href={this.props.href || 'javascript:;' }>
                    <span className={this.props.icon || undefined}>{this.props.text}</span>
                </a>
            </div>
        );
    }
}


const DrawerHeader = ({
    alignment,
    closeBtn,
}) => {
    const drawer_header_class = classNames('drawer-header', alignment);
    return (
        <React.Fragment>
            {alignment && alignment === 'right' ?
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                </div>
            :
                <div className={drawer_header_class}>
                    <div className='icons btn-close' onClick={closeBtn}>
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                    <div className='icons brand-logo'>
                        <img src={Url.urlForStatic('images/trading_app/header/binary_logo_dark.svg')} alt='Binary.com' />
                    </div>
                </div>
        }
        </React.Fragment>
    );
};

module.exports = {
    Drawer,
    DrawerItem,
    DrawerItems,
    ToggleDrawer,
};
