import React from 'react';
import Url from '../../../../../_common/url';

class ToggleDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.setRef = this.setRef.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    setRef(node) {
        this.Ref = node;
    }

    showDrawer() {
        this.Ref.show();
    }

    closeDrawer() {
        this.Ref.hide();
    }

    render() {
        return (
            <React.Fragment>
                <div className='navbar-icons menu-toggle' onClick={this.showDrawer}>
                    <img src={Url.urlForStatic('images/trading_app/menu.svg')} alt='Menu' />
                </div>
                <Drawer ref={this.setRef} alignment={this.props.alignment}>
                    <DrawerHeader alignment={this.props.alignment} close={this.closeDrawer}/>
                    {this.props.children}
                </Drawer>
            </React.Fragment>
        );
    }
}

class Drawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drawerVisible: false,
        };
        this.setRef = this.setRef.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.scrollToggle = this.scrollToggle.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setRef(node) {
        this.Ref = node;
    }

    scrollToggle(state) {
        this.isOpen = state;
        if (this.isOpen) {
            document.body.classList.add('noScroll');
        }
        else {
            document.body.classList.remove('noScroll');
        }
    }

    show() {
        this.setState({ drawerVisible: true });
    }

    hide() {
        this.setState({ drawerVisible: false });
    }

    handleClickOutside(event) {
        event.stopPropagation();
        if (this.Ref && !this.Ref.contains(event.target)) {
            this.hide();
        }
    }

    render() {
        return (
            <aside className='drawer-container'>
                <div className={`drawer-bg ${this.state.drawerVisible ? 'show' : 'hide'}`}>
                    <div ref={this.setRef} className={`drawer ${this.state.drawerVisible ? 'visible' : ''} ${this.props.alignment}`}>{this.props.children}</div>
                </div>
            </aside>
        );
    }
}

class DrawerHeader extends React.Component {

    render() {
        return (
            <React.Fragment>
            {this.props.alignment && this.props.alignment === 'right' ?
                <div className={`drawer-header ${this.props.alignment}`}>
                    <div className='icons btn-close' onClick={this.props.close}>
                        <img src={Url.urlForStatic('images/trading_app/close.svg')} alt='Close' />
                    </div>
                </div>
            :
                <div className={`drawer-header ${this.props.alignment}`}>
                    <div className='icons btn-close' onClick={this.props.close}>
                        <img src={Url.urlForStatic('images/trading_app/close.svg')} alt='Close' />
                    </div>
                    <div className='icons brand-logo'>
                        <img src={Url.urlForStatic('images/trading_app/binary_logo_dark.svg')} alt='Binary.com' />
                    </div>
                </div>
            }
            </React.Fragment>
        );
    }
}

class DrawerItem extends React.Component {

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
    DrawerHeader,
    DrawerItem,
    ToggleDrawer,
};
