import React from 'react';
import { Li } from '../../_common/components/elements.jsx';

const MobileMenu = () => (
    <div className='gr-hide gr-show-m gr-show-p' id='mobile-menu-container'>
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
                <Li text={it.L('Trade')}       href={it.url_for('multi_barriers_trading')} className='invisible ja-show client_logged_out' />
                {/* Logged in */}
                {/* General */}
                <Li text={it.L('Trade')}        href={it.url_for('trading')}             className='ja-hide mt-hide client_logged_in invisible' />
                <Li text={it.L('Portfolio')}    href={it.url_for('user/portfoliows')}    className='ja-hide mt-hide client_logged_in invisible' />
                <Li text={it.L('Profit Table')} href={it.url_for('user/profit_tablews')} className='ja-hide mt-hide client_logged_in invisible' />
                <Li text={it.L('Statement')}    href={it.url_for('user/statementws')}    className='ja-hide mt-hide client_logged_in invisible' />
                <Li text={it.L('Cashier')}      href={it.url_for('cashier')}             className='ja-hide mt-hide client_logged_in invisible' />
                <Li
                    text={it.L('Resources')}
                    href={it.url_for('resources')}
                    className='ja-hide mt-hide client_logged_in invisible'
                    subitems={[
                        { text: it.L('Asset Index'),   href: it.url_for('resources/asset_indexws') },
                        { text: it.L('Trading Times'), href: it.url_for('resources/market_timesws') },
                    ]}
                />
                {/* Japan */}
                <Li text={it.L('Trade')}        href={it.url_for('multi_barriers_trading')} className='ja-show mt-hide client_logged_in invisible' />
                <Li text={it.L('Portfolio')}    href={it.url_for('user/portfoliows')}       className='ja-show mt-hide client_logged_in invisible' />
                <Li text={it.L('Profit Table')} href={it.url_for('user/profit_tablews')}    className='ja-show mt-hide client_logged_in invisible' />
                <Li text={it.L('Statement')}    href={it.url_for('user/statementws')}       className='ja-show mt-hide client_logged_in invisible' />
                <Li text={it.L('Cashier')}      href={it.url_for('cashier')}                className='ja-show mt-hide client_logged_in invisible' />
                <Li
                    text={it.L('Resources')}
                    href={it.url_for('resources')}
                    className='ja-show mt-hide client_logged_in invisible'
                    subitems={[
                        { text: it.L('Trading Times'), href: it.url_for('resources/market_timesws')},
                    ]}
                />
                {/* MetaTrader */}
                <Li text={it.L('MetaTrader')}  href={it.url_for('user/metatrader')}                       className='invisible mt-show' />
                <Li text={it.L('Cashier')}     href={it.url_for('cashier')}                               className='invisible mt-show' />
                <Li text={it.L('Get Started')} href={it.url_for('get-started-beta?get_started_tabs=mt5')} className='invisible mt-show' />
                <Li text={it.L('Platforms')}   href={it.url_for('platforms?platforms_tabs=mt5')}          className='invisible mt-show' />
            </ul>
        </div>
    </div>
);

export default MobileMenu;
