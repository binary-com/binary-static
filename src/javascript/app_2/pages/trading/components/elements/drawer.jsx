import React from 'react';
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
        return (
            <React.Fragment>
                <div className='navbar-icons menu-toggle' onClick={this.showDrawer}>
                    {this.props.icon_link ?
                        <img src={this.props.icon_link} />
                    :
                        <img src={Url.urlForStatic('images/trading_app/header/menu.svg')} />
                    }
                </div>
                <Drawer ref={this.setRef} alignment={this.props.alignment}>
                    <DrawerHeader alignment={this.props.alignment} close={this.closeDrawer}/>
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
        return (
            <aside className='drawer-container'>
                <div className={`drawer-bg ${this.state.is_drawer_visible ? 'show' : 'hide'}` } onClick={this.handleClickOutside}>
                    <div
                        ref={this.setRef}
                        className={`drawer ${this.state.is_drawer_visible ? 'visible' : ''} ${this.props.alignment}`}
                    >
                        {this.props.children}
                    </div>
                </div>
            </aside>
        );
    }
}

class DrawerHeader extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
            {this.props.alignment && this.props.alignment === 'right' ?
                <div className={`drawer-header ${this.props.alignment}`}>
                    <div className='icons btn-close' onClick={this.props.close}>
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                </div>
            :
                <div className={`drawer-header ${this.props.alignment}`}>
                    <div className='icons btn-close' onClick={this.props.close}>
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                    <div className='icons brand-logo'>
                        <img src={Url.urlForStatic('images/trading_app/header/binary_logo_dark.svg')} alt='Binary.com' />
                    </div>
                </div>
            }
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

module.exports = {
    Drawer,
    DrawerItem,
    ToggleDrawer,
};
