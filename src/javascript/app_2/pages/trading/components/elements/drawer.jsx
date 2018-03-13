import React from 'react';
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LanguageSwitcher from './language_switcher.jsx';
import Url from '../../../../../_common/url';
import { localize } from '../../../../../_common/localize';

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
                <Drawer ref={this.setRef} alignment={this.props.alignment}>
                    <DrawerHeader alignment={this.props.alignment} closeBtn={this.closeDrawer}/>
                    {this.props.children}
                    <DrawerFooter alignment={this.props.alignment} />
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
        this.scrollToggle       = this.scrollToggle.bind(this);
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
                    onClick={this.handleClickOutside}>
                    <div
                        ref={this.setRef}
                        className={drawer_class}
                        style={visibility}
                    >
                        {this.props.children}
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
}) => (
    <React.Fragment>
    {alignment && alignment === 'right' ?
        <div className={`drawer-header ${alignment}`}>
            <div className='icons btn-close' onClick={closeBtn}>
                <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
            </div>
        </div>
    :
        <div className={`drawer-header ${alignment}`}>
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

const DrawerFooter = ({
    alignment,
}) => (
    <React.Fragment>
    {alignment && alignment === 'right' ?
        null
    :
        <div className='drawer-footer'>
        </div>
    }
    </React.Fragment>
);

const MenuDrawer = () => (
    <PerfectScrollbar>
        <div className='list-items-container'>
            <DrawerItems
                text={localize('Account Settings')}
                items={[
                    { text: localize('Personal Detail') },
                    { text: localize('Account Authentication') },
                    { text: localize('Financial Assessment') },
                    { text: localize('Professional Trader') },
                ]}
            />
            <DrawerItems
                text={localize('Security Settings')}
                items={[
                    { text: localize('Self Exclusion') },
                    { text: localize('Trading Limits') },
                    { text: localize('Authorised Applications') },
                    { text: localize('API Token') },
                ]}
            />
            <DrawerItems
                text={localize('Trading History')}
                items={[
                    { text: localize('Portfolio') },
                    { text: localize('Profit Table') },
                    { text: localize('Statement') },
                ]}
            />
            <DrawerItem text={localize('Cashier')} />
            <hr />
            <DrawerItem text={localize('Manage Password')} />
            <DrawerItem text={localize('Useful Resources')}/>
            <DrawerItem text={localize('Login History')}/>
            <hr />
            <LanguageSwitcher />
        </div>
    </PerfectScrollbar>
);

module.exports = {
    Drawer,
    DrawerItem,
    DrawerItems,
    MenuDrawer,
    ToggleDrawer,
};
