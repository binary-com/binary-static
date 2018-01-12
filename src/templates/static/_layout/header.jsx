import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const LanguageUl = ({type, color}) => {
    const id = `${type}_language`;
    const world_color = `world-${color}`;
    return (
        <ul id={id}>
            <li>
                <span className={`world ${world_color}`}></span>
                <div className='language-wrapper'>
                    <span className='language'></span>
                </div>
                <span className='nav-caret'></span>
            </li>
        </ul>
    );
};
const Account = () => (
    <a href='javascript:;'>
        <div className='main-account'>
            <div className='account-type nowrap'></div>
            <div className='account-id'></div>
            <div className='topMenuBalance'>0</div>
        </div>
        <div className='nav-caret'></div>
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
                    <a className='pulser invisible'></a>
                </div>
                <div className='gr-6 gr-7-t gr-12-p gr-12-m' id='topbar-info'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-6-m no-underline nowrap' id='gmt-clock' data-balloon-pos='down'></div>
                        <div className='gr-2 gr-hide-m' id='contact-us'>
                            <a href={it.url_for('contact')}>{it.L('Contact Us')}</a>
                        </div>
                        <div className='gr-5 gr-6-m'>
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
                            <a id='logo' href='javascript:;'>
                                <div className='gr-row logo-parent'>
                                    <div className='gr-3 gr-12-m gr-12-p gr-no-gutter logo'>
                                        <div></div>
                                    </div>
                                    <div className='gr-9 gr-hide-m gr-hide-p binary-logo-text'>
                                        <div></div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className='gr-6 gr-hide-m gr-hide-p gr-padding-10'>
                            <div id='main-navigation'>
                                <List
                                    id='menu-top'
                                    className='center-text nowrap'
                                    items={[
                                        // General
                                        { text: it.L('Why Us?'),     href: it.url_for('why-us'),                      className: 'ja-hide mt-hide' },
                                        { text: it.L('Get Started'), href: it.url_for('get-started'),                 className: 'ja-hide mt-hide' },
                                        { text: it.L('Tour'),        href: it.url_for('tour'),                        className: 'ja-hide mt-hide' },
                                        { text: it.L('Platforms'),   href: it.url_for('platforms'),                   className: 'ja-hide mt-hide',          id: 'main-navigation-trading' },
                                        // Japan
                                        { text: it.L('Why Us?'),     href: it.url_for('why-us-jp'),                   className: 'invisible ja-show mt-hide' },
                                        { text: it.L('Get Started'), href: it.url_for('get-started-jp'),              className: 'invisible ja-show mt-hide' },
                                        { text: it.L('Tour'),        href: it.url_for('tour-jp'),                     className: 'invisible ja-show mt-hide' },
                                        { text: it.L('Trade'),       href: it.url_for('multi_barriers_trading'),      className: 'invisible ja-show mt-hide', id: 'main-navigation-jptrading' },
                                        // MetaTrader
                                        { text: it.L('MetaTrader'),  href: it.url_for('user/metatrader'),                       className: 'invisible mt-show' },
                                        { text: it.L('Cashier'),     href: it.url_for('cashier'),                               className: 'invisible mt-show' },
                                        { text: it.L('Get Started'), href: it.url_for('get-started-beta?get_started_tabs=mt5'), className: 'invisible mt-show' },
                                        { text: it.L('Platforms'),   href: it.url_for('platforms?platforms_tabs=mt5'),          className: 'invisible mt-show' },
                                    ]}
                                />
                            </div>
                        </div>
                        <div id='client-logged-in' className='gr-3 gr-7-m gr-8-p gr-no-gutter client_real client_virtual center-text invisible'>
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
                                            <div className='login-id-list'></div>
                                            <a className='link' href={it.url_for('user/settingsws')}>
                                                <li className='topMenuProfile'>{it.L('Profile')}</li>
                                            </a>
                                            <a className='link' href={it.url_for('user/securityws')}>
                                                <li className='topMenuSecurity'>{it.L('Security & Limits')}</li>
                                            </a>
                                            <a className='link ja-hide' id='user_accounts' href={it.url_for('user/accounts')}>
                                                <li className='topMenuAccounts'>{it.L('Accounts List')}</li>
                                            </a>
                                            <a className='link invisible' id='user_menu_metatrader' href={it.url_for('user/metatrader')}>
                                                <li className='topMenuMetaTrader'>{it.L('MetaTrader')}</li>
                                            </a>
                                            <a className='link invisible' id='user_menu_account_transfer' href={it.url_for('cashier/account_transfer')}>
                                                <li>{it.L('Transfer Between Accounts')}</li>
                                            </a>
                                            <div className='separator-line-thin-gray'></div>
                                            <a href='javascript:;' id='btn_logout' className='logout'>
                                                <li>{it.L('Sign out')}</li>
                                            </a>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id='client-logged-out' className='gr-3 gr-8-m gr-8-p gr-no-gutter client_logged_out invisible gr-padding-10'>
                            <a id='btn_login' className='button' href='javascript:;'><span>{it.L('Log in')}</span></a>
                        </div>
                        <div className='gr-hide gr-show-m gr-2-m gr-show-p gr-1-p gr-no-gutter-mobile align-end'>
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
