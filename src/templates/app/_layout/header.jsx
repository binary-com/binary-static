import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const LanguageUl = ({ type, color }) => {
    const id = `${type}_language`;
    const world_color = `world-${color}`;
    return (
        <ul id={id}>
            <li>
                <span className={`world ${world_color}`} />
                <div className='language-wrapper'>
                    <span className='language' />
                </div>
                <span className='nav-caret' />
            </li>
        </ul>
    );
};
const Account = () => (
    <a href='javascript:;'>
        <div className='main-account'>
            <div className='account-type nowrap' />
            <div className='account-id' />
            <div className='topMenuBalance'>0</div>
        </div>
        <div className='nav-caret' />
    </a>
);

const Topbar = () => (
    <div id='topbar' className='no-print primary-bg-color-dark'>
        <div className='container'>
            <div className='gr-row'>
                <div id='topbar-msg' className='gr-6 gr-5-t gr-12-p gr-12-m invisible upgrademessage center-text'>
                    <span className='gr-hide-m invisible' id='virtual-wrapper'>
                        <span id='virtual-text'>{it.L('You\'re using a Virtual Account.')}</span>
                    </span>
                    <a className='pulser invisible' />
                </div>
                <div className='gr-6 gr-7-t gr-12-p gr-12-m' id='topbar-info'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-6-m no-underline nowrap' id='gmt-clock' data-balloon-pos='down' />
                        <div className='gr-1 align-self-center no-underline' data-balloon-pos='down'>
                            <div id='network_status' />
                        </div>
                        <div className='gr-2 gr-hide-m' id='contact-us'>
                            <a href={it.url_for('contact')}>{it.L('Contact Us')}</a>
                        </div>
                        <div className='gr-4 gr-5-m'>
                            <div className='languages invisible'>
                                <LanguageUl type='display'  color='white' />
                                <LanguageUl type='select'   color='black' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Header = () => (
    <React.Fragment>
        <Topbar />

        <div id='header' className='no-print'>
            <div className='container'>
                <div className='gr-12'>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-3 gr-2-m gr-2-p'>
                            <a id='logo' href='javascript:;' className='gr-11'>
                                <div className='gr-row logo-parent'>
                                    <div className='gr-3 gr-12-m gr-12-p gr-no-gutter logo'>
                                        <div />
                                    </div>
                                    <div className='gr-9 gr-hide-m gr-hide-p binary-logo-text'>
                                        <div />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className='gr-7 gr-hide-m gr-hide-p gr-hide-t gr-padding-10'>
                            <div id='main-navigation'>
                                <List
                                    id='menu-top'
                                    className='center-text nowrap'
                                    items={[
                                        // Logged out
                                        // General
                                        { text: it.L('Why Us?'),     href: it.url_for('why-us'),      className: 'ja-hide client_logged_out invisible' },
                                        { text: it.L('Get Started'), href: it.url_for('get-started'), className: 'ja-hide client_logged_out invisible' },
                                        { text: it.L('Tour'),        href: it.url_for('tour'),        className: 'ja-hide client_logged_out invisible' },
                                        { text: it.L('Platforms'),   href: it.url_for('platforms'),   className: 'ja-hide client_logged_out invisible' },
                                        // Japan
                                        { text: it.L('Why Us?'),     href: it.url_for('why-us-jp'),              className: 'invisible ja-show client_logged_out' },
                                        { text: it.L('Get Started'), href: it.url_for('get-started-jp'),         className: 'invisible ja-show client_logged_out' },
                                        { text: it.L('Tour'),        href: it.url_for('tour-jp'),                className: 'invisible ja-show client_logged_out' },
                                        { text: it.L('Trade'),       href: it.url_for('multi_barriers_trading'), className: 'invisible ja-show' },

                                        // Logged in
                                        // General
                                        {
                                            type     : 'nested',
                                            text     : it.L('Trade'),
                                            href     : 'javascript:;',
                                            className: 'ja-hide ico-only-hide client_logged_in nav-dropdown-toggle invisible',
                                            subitems : [
                                                { text: it.L('SmartTrader'),  href: it.url_for('trading'),          className: 'no-capitalize' },
                                                { text: it.L('WebTrader'),    href: 'https://webtrader.binary.com', target: '_blank' },
                                                { text: it.L('Binary Bot'),   href: 'https://bot.binary.com',       target: '_blank' },
                                                { text: it.L('MetaTrader 5'), href: it.url_for('user/metatrader') },
                                            ],
                                        },
                                        { text: it.L('Portfolio'),    href: it.url_for('user/portfoliows'),    className: 'ico-only-hide client_logged_in invisible' },
                                        { text: it.L('Profit Table'), href: it.url_for('user/profit_tablews'), className: 'ico-only-hide client_logged_in invisible' },
                                        { text: it.L('Statement'),    href: it.url_for('user/statementws'),    className: 'client_logged_in invisible' },
                                        { text: it.L('Cashier'),      href: it.url_for('cashier'),             className: 'client_logged_in invisible', id: 'topMenuCashier' },
                                        {
                                            type     : 'nested',
                                            text     : it.L('Resources'),
                                            href     : 'javascript:;',
                                            className: 'ico-only-hide client_logged_in nav-dropdown-toggle invisible',
                                            subitems : [
                                                { text: it.L('Asset Index'),   href: it.url_for('resources/asset_indexws'), className: 'ja-hide' },
                                                { text: it.L('Trading Times'), href: it.url_for('resources/market_timesws') },
                                            ],
                                        },
                                        {
                                            type     : 'nested',
                                            text     : it.L('Settings'),
                                            href     : 'javascript:;',
                                            className: 'client_logged_in nav-dropdown-toggle invisible',
                                            subitems : [
                                                { text: it.L('Profile'),           href: it.url_for('user/settingsws') },
                                                { text: it.L('Security & Limits'), href: it.url_for('user/securityws') },
                                                { text: it.L('Payment Agent'),     href: it.url_for('paymentagent/transferws'), id: 'topMenuPaymentAgent', className: 'invisible' },
                                            ],
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        <div id='client-logged-in' className='gr-2 gr-7-m gr-8-p gr-8-t gr-no-gutter client_real client_virtual center-text invisible'>
                            <div id='main-logout'>
                                <ul id='main-account' className='nav-menu main-nav'>
                                    <li className='account'>
                                        <Account />
                                    </li>
                                </ul>
                                <ul id='all-accounts' className='nav-menu main-nav'>
                                    <li className='account'>
                                        <Account />
                                        <ul>
                                            <div className='login-id-list' />
                                            <a className='link ja-hide invisible' id='user_menu_metatrader' href={it.url_for('user/metatrader')}>
                                                <li className='topMenuMetaTrader'>{it.L('MetaTrader')}</li>
                                            </a>
                                            <a className='link ja-hide' id='user_accounts' href={it.url_for('user/accounts')}>
                                                <li className='topMenuAccounts'>{it.L('Accounts List')}</li>
                                            </a>
                                            <a className='link invisible' id='user_menu_account_transfer' href={it.url_for('cashier/account_transfer')}>
                                                <li>{it.L('Transfer Between Accounts')}</li>
                                            </a>
                                            <div className='separator-line-thin-gray' />
                                            <a href='javascript:;' id='btn_logout' className='logout'>
                                                <li>{it.L('Sign out')}</li>
                                            </a>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id='client-logged-out' className='gr-2 gr-8-m gr-8-p gr-8-t gr-no-gutter client_logged_out invisible gr-padding-10'>
                            <a id='btn_login' className='button' href='javascript:;'><span>{it.L('Log in')}</span></a>
                        </div>
                        <div className='gr-hide gr-show-m gr-2-m gr-show-t gr-1-t gr-show-p gr-1-p gr-no-gutter-mobile align-end'>
                            <div id='mobile-menu-icon-container'>
                                <a href='#mobile-menu' id='mobile-menu-icon'>
                                    <img className='responsive' src={it.url_for('images/pages/binary-mobile-menu.svg')} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Header;
