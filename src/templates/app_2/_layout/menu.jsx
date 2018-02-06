import React from 'react';

const Menu = () => (
    <div id='menu'>
        <aside id='material-drawer' className='mdc-temporary-drawer mdc-typography menu-list'>
            <nav className='mdc-temporary-drawer__drawer drawer-container'>
                <div className='drawer-header'>
                    <div className='drawer-icons menu-close'><img src={it.url_for('images/pages/new-ui/header/close.svg')} alt='Close'></img></div>
                    <div className='drawer-icons binary-logo'><img src={it.url_for('images/pages/new-ui/header/binary_logo_dark.svg')} alt='Binary.com'></img></div>
                </div>
                <nav className='mdc-temporary-drawer__content mdc-list'>
                    <a className='mdc-list-item mdc-temporary-drawer--selected drawer-items' href='#'><span>{it.L('Account Settings')}</span></a>
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Security Settings')}</span></a>
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Trading History')}</span></a>
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Cashier')}</span></a>
                    <hr />
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Manage Password')}</span></a>
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Useful Resources')}</span></a>
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Login History')}</span></a>
                    <hr />
                    <a className='mdc-list-item drawer-items' href='#'><span>{it.L('Language')}</span></a>
                </nav>
            </nav>
        </aside>
        <aside id='material-drawer' className='mdc-temporary-drawer mdc-temporary-drawer--right mdc-typography notifications-list'>
            <nav className='mdc-temporary-drawer__drawer drawer-container'>
                <div className='drawer-header'>
                    <div className='drawer-icons notification'><span>{it.L('Notifications')}</span></div>
                    <div className='drawer-icons notifications-close'><img src={it.url_for('images/pages/new-ui/header/close.svg')} alt='Close'></img></div>
                </div>
                <nav className='mdc-temporary-drawer__content mdc-list'>
                    <a className='mdc-list-item notification-items mdc-temporary-drawer--selected' href='#'><span>{it.L('Alert')}</span></a>
                    <a className='mdc-list-item notification-items' href='#'><span>{it.L('Alert')}</span></a>
                    <a className='mdc-list-item notification-items' href='#'><span>{it.L('Alert')}</span></a>
                    <a className='mdc-list-item notification-items' href='#'><span>{it.L('Alert')}</span></a>
                </nav>
            </nav>
        </aside>
    </div>
);

export default Menu;
