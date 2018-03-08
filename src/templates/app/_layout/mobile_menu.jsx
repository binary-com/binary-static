import React from 'react';
import { Li } from '../../_common/components/elements.jsx';

const MobileMenu = () => (
    <div className='gr-hide gr-show-m gr-show-t gr-show-p' id='mobile-menu-container'>
        <div className='gr-hide' id='mobile-menu'>
            <ul>
                {/* Logged out */}
                {/* General */}
                <Li text={it.L('Why Us?')}     href={it.url_for('why-us')}      className='ja-hide client_logged_out invisible' />
                <Li text={it.L('Get Started')} href={it.url_for('get-started')} className='ja-hide client_logged_out invisible' />
                <Li text={it.L('Tour')}        href={it.url_for('tour')}        className='ja-hide client_logged_out invisible' />
                <Li text={it.L('Platforms')}   href={it.url_for('platforms')}   className='ja-hide client_logged_out invisible' />
                {/* Japan */}
                <Li text={it.L('Why Us?')}     href={it.url_for('why-us-jp')}              className='invisible ja-show client_logged_out' />
                <Li text={it.L('Get Started')} href={it.url_for('get-started-jp')}         className='invisible ja-show client_logged_out' />
                <Li text={it.L('Tour')}        href={it.url_for('tour-jp')}                className='invisible ja-show client_logged_out' />
                <Li text={it.L('Trade')}       href={it.url_for('multi_barriers_trading')} className='invisible ja-show' />
                {/* Logged in */}
                {/* General */}
                <Li
                    text={it.L('Trade')}
                    href={it.url_for('trading')}
                    className='ja-hide ico-only-hide client_logged_in invisible'
                    subitems={[
                        { text: it.L('SmartTrader'),  href: it.url_for('trading'), className: 'no-capitalize' },
                        { text: it.L('WebTrader'),    href: 'https://webtrader.binary.com', target: '_blank' },
                        { text: it.L('Binary Bot'),   href: 'https://bot.binary.com',       target: '_blank' },
                        { text: it.L('MetaTrader 5'), href: it.url_for('user/metatrader') },
                    ]}
                />
                <Li text={it.L('Portfolio')}    href={it.url_for('user/portfoliows')}    className='ico-only-hide client_logged_in invisible' />
                <Li text={it.L('Profit Table')} href={it.url_for('user/profit_tablews')} className='ico-only-hide client_logged_in invisible' />
                <Li text={it.L('Statement')}    href={it.url_for('user/statementws')}    className='client_logged_in invisible' />
                <Li text={it.L('Cashier')}      href={it.url_for('cashier')}             className='client_logged_in invisible' id='topMenuCashier' />
                <Li
                    text={it.L('Resources')}
                    href={it.url_for('resources')}
                    className='ico-only-hide client_logged_in invisible'
                    subitems={[
                        { text: it.L('Asset Index'),   href: it.url_for('resources/asset_indexws'), className: 'ja-hide' },
                        { text: it.L('Trading Times'), href: it.url_for('resources/market_timesws') },
                    ]}
                />
                <Li text={it.L('Profile')}            href={it.url_for('user/settingsws')}         className='client_logged_in invisible' />
                <Li text={it.L('Security & Limits')}  href={it.url_for('user/securityws')}         className='client_logged_in invisible' />
                <Li text={it.L('Payment Agent')}      href={it.url_for('paymentagent/transferws')} className='invisible' id='topMenuPaymentAgent' />
            </ul>
        </div>
    </div>
);

export default MobileMenu;
