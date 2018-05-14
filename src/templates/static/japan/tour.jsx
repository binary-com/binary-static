import React from 'react';

const ComponentName = () => (
    <div className='tour container'>
        <div className='static_full'>
            <div className='section'>
                <div className='section-content'>
                    <h1>{it.L('{JAPAN ONLY}Trading manual')}</h1>

                    <p>{it.L('{JAPAN ONLY}Our trading page provides an overall view of all the option contracts available to trade, showing the live buy and sell prices and providing quick selection and trading buttons.')}</p>
                    <img className='gr-8 gr-12-m gr-centered' src={it.url_for('images/pages/tour-jp/trade.png')} />

                    <p>{it.L('{JAPAN ONLY}In the lower panel you can also choose to see your current portfolio with live valuations and quick access to sell-back. Alternatively you can view a live, customizable chart with many add-on features; or see more detailed explanations of the type of option selected; or examine recent settlement prices for expired options.')}</p>
                    <img className='responsive' src={it.url_for('images/pages/tour-jp/analysis.png')} />
                </div>
            </div>
            <div className='section'>
                <div className='section-content'>
                    <h1>{it.L('{JAPAN ONLY}Executing trades')}</h1>

                    <p>{it.L('{JAPAN ONLY}To buy an option, simply click on the price button to execute the trade.')}</p>
                    <img className='responsive gr-5 gr-8-m gr-centered' src={it.url_for('images/pages/tour-jp/buy_buttons.png')} />

                    <p>{it.L('{JAPAN ONLY}Full details of the confirmed trade will then be shown, alongside a live updating graph showing the spot FX rate relative to the barrier(s) chosen. A sell-back price is available should you wish to close-out the trade.')}</p>
                    <img className='responsive gr-8 gr-12-m gr-centered gr-padding-20 gr-parent' src={it.url_for('images/pages/tour-jp/tradeview.png')} />

                    <p>{it.L('{JAPAN ONLY}This popup window can also be activated from the portfolio panel, and portfolio page, by clicking the Trade View button.')}</p>
                    <img className='responsive gr-8 gr-12-m gr-centered' src={it.url_for('images/pages/tour-jp/trade_in_portfolio.png')} />

                    <p>{it.L('{JAPAN ONLY}You can then review the performance of the trade and then sell-back to close the position if you wish, by clicking the sell-back button.')}</p>
                    <img className='responsive gr-8 gr-12-m gr-centered' src={it.url_for('images/pages/tour-jp/sell_tradeview.png')} />

                    <p>{it.L('{JAPAN ONLY}The sell-back execution level will then be confirmed and the position will be closed.')}</p>
                    <img className='responsive gr-4 gr-8-m gr-centered' src={it.url_for('images/pages/tour-jp/sell_confirm.png')} />

                    <p>{it.L('{JAPAN ONLY}Our customer support are available to help you if you are unsure about how to use our trading tools. Please email them at <a href=\'mailto:[_1]\'>[_1]</a>', 'support@binary.com')}</p>
                    <p>{it.L('{JAPAN ONLY}Don\'t forget you can practice as much as you like using your Virtual / Demo account.')}</p>
                </div>
            </div>
        </div>
    </div>
);

export default ComponentName;
