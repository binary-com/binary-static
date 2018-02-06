import React from 'react';

const Header = () => (
    <header className='mdc-elevation--z2'>
        <div className='menu-items'>
            <div className='menu-left'>
                <div className='navbar-icons menu-toggle'><img src={it.url_for('images/pages/new-ui/header/menu.svg')} alt='Menu'></img></div>
                <div className='navbar-icons binary-logo'><img className='logo-img' src={it.url_for('images/pages/binary-symbol-logo.svg')} alt='Binary.com'></img></div>
                <div className='menu-links'>
                    <a href={it.url_for('app_2/trade')}><span>{it.L('Trade')}</span></a>
                    <a href='#'><span>{it.L('Portfolio')}</span></a>
                    <a href='#'><span>{it.L('Statement')}</span></a>
                    <a href='#'><span>{it.L('Cashier')}</span></a>
                </div>
            </div>
            <div className='navbar-icons notifications-toggle'><img src={it.url_for('images/pages/new-ui/header/notify_none.svg')} alt='Alert'></img></div>
        </div>
    </header>
);

export default Header;
