import PropTypes           from 'prop-types';
import React               from 'react';
import { AccountBalance }  from '../Elements/account_balance.jsx';
import AccountSwitcher     from '../Elements/account_switcher.jsx';
import { Notifications }   from '../Elements/Notifications';
import { ToggleDrawer }    from '../Elements/Drawer';
import { MenuDrawer }      from '../Elements/menu_drawer.jsx';
import Inkbar              from '../Elements/Inkbar';
import { BinaryLink }      from '../../routes';
import Url                 from '../../../../_common/url';

class Header extends React.Component {
    state = {
        width: 0,
        left : 0,
    };

    componentDidMount() {
        if (!this.node) return;
        this.updateInkbarPosition(this.node.querySelector('a[aria-current="true"]'));
    }

    onClick = (e) => {
        if (!e.target) return;
        this.updateInkbarPosition(e.target.closest('a'));
    }

    updateInkbarPosition = (el) => {
        if (!el) return;
        const { left, width } = el.getBoundingClientRect();
        this.setState({ left, width });
    }

    render() {
        const { items } = this.props;

        return (
            <React.Fragment>
                <header className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left'>
                                <AccountSwitcher />
                                <MenuDrawer />
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/app_2/header/symbol.svg')} alt='Binary.com' />
                            </div>
                            {!!items.length &&
                                <div className='menu-links' ref={node => { this.node = node; }}>
                                    {items.map((item, idx) => (
                                        <BinaryLink onClick={this.onClick.bind(this)} key={idx} to={item.link_to}>
                                            <span className={item.icon} title={item.text}>{item.text}</span>
                                        </BinaryLink>
                                    ))}
                                    <Inkbar left={this.state.left} width={this.state.width} />
                                </div>
                            }
                        </div>
                        <div className='menu-right'>
                            <AccountBalance />
                        </div>
                        <ToggleDrawer
                            icon_class='notify-toggle'
                            alignment='right'
                            icon_link={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')}
                        >
                            <Notifications />
                        </ToggleDrawer>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    items: PropTypes.array,
};

export default Header;
