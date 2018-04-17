import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const Section = ({ id, header, children }) => (
    <div className='section'>
        <a id={id} />
        <div className='section-content'>
            <h1>{header}</h1>
            {children}
        </div>
    </div>
);

const WhyUs = () => {
    const items = [
        { id: 'sidebar-link-section-1', href: '#section-one',   text: it.L('Sharp prices'), className: 'selected'},
        { id: 'sidebar-link-section-2', href: '#section-two',   text: it.L('Flexible trades') },
        { id: 'sidebar-link-section-3', href: '#section-three', text: it.L('Controlled risk') },
        { id: 'sidebar-link-section-4', href: '#section-four',  text: it.L('{JAPAN ONLY}Your Funds') },
        { id: 'sidebar-link-section-5', href: '#section-five',  text: it.L('Trust') },
    ];

    return (
        <div className='container'>
            <div className='why-us static_full gr-row'>
                <div className='gr-3 gr-hide-m sidebar-container'>
                    <div className='sidebar'>
                        <List id='sidebar-nav' items={items} />
                        <div className='center-text gr-padding-10 client_logged_out invisible'>
                            <a className='button' href={it.url_for('home-jp')}>
                                <span>{it.L('Open a free account')}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='gr-9 gr-12-m gr-parent'>
                    <Section id='section-one' header={it.L('Why pay more?')} >
                        <p>{it.L('[_1]\'s patented pricing technology allows you to benefit from the same rates of return as traders in the interbank market.', it.website_name)}</p>
                        <ul className='checked'>
                            <li>{it.L('{JAPAN ONLY}We offer real time prices calculated from the same rates that bank and securities companies use.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer a full range of binary option types including ladders, touch, and range options.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer trading periods from as short as 2 hours to as long as one-year, in predefined contract series.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer transparent 2-way pricing, allowing equal chance to trade in either direction of the market.')}</li>
                            <li>{it.L('{JAPAN ONLY}We will pass on any possible price improvements for orders in fast moving markets.')}</li>
                        </ul>
                    </Section>
                    <Section id='section-two' header={it.L('Trade your way')} >
                        <p>{it.L('[_1]\'s patented pricing technology allows you to benefit from the same rates of return as traders in the interbank market.', it.website_name)}</p>
                        <ul className='checked'>
                            <li>{it.L('{JAPAN ONLY}We offer real time prices calculated from the same rates that bank and securities companies use.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer a full range of binary option types including ladders, touch, and range options.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer trading periods from as short as 2 hours to as long as one-year, in predefined contract series.')}</li>
                            <li>{it.L('{JAPAN ONLY}We offer transparent 2-way pricing, allowing equal chance to trade in either direction of the market.')}</li>
                            <li>{it.L('{JAPAN ONLY}We will pass on any possible price improvements for orders in fast moving markets.')}</li>
                        </ul>
                        <p>{it.L('Our trading screen is simple to use:')}</p>
                        <ol className='split start'>
                            <li>{it.L('{JAPAN ONLY}Select an FX rate')}</li>
                            <li>{it.L('{JAPAN ONLY}Select an option type')}</li>
                            <li>{it.L('{JAPAN ONLY}Select a trading period')}</li>
                            <li>{it.L('{JAPAN ONLY}Select payout size')}</li>
                        </ol>
                        <div className='gr-padding-10'>
                            <img className='responsive' src={it.url_for('images/pages/why-us-jp/trade_form.png')} />
                        </div>
                        <ol className='split'>
                            <li>{it.L('{JAPAN ONLY}Choose direction of the market and the exercise price you wish to target, and hit the green buy button to instantly trade')}</li>
                        </ol>
                        <p>{it.L('{JAPAN ONLY}No fees, no commissions, you simply pay the price of the stated on the buy button.')}</p>
                        <p>{it.L('{JAPAN ONLY}Track your trade in real time:')}</p>
                        <div className='gr-padding-10'>
                            <img className='responsive' src={it.url_for('images/pages/why-us-jp/track_trade.png')} />
                        </div>
                        <ul className='checked'>
                            <li>{it.L('{JAPAN ONLY}Live analysis of trade and charting of spot relative to trade barriers')}</li>
                            <li>{it.L('{JAPAN ONLY}Instant sell-back of position available until 2 minutes prior to judgement time')}</li>
                        </ul>
                    </Section>
                    <Section id='section-three' header={it.L('You won\'t lose your shirt')} >
                        <ul className='checked'>
                            <li>{it.L('{JAPAN ONLY}You set your own personal daily loss limit')}</li>
                            <li>{it.L('{JAPAN ONLY}You can protect your account value further by setting other limits to encourage trading discipline')}</li>
                            <li>{it.L('{JAPAN ONLY}You will always know your maximum loss, as it is limited to the amount that you have paid')}</li>
                            <li>{it.L('{JAPAN ONLY}Your investments are immediately reflected in your account balance, so there is no further risk')}</li>
                            <li>{it.L('{JAPAN ONLY}You can sell-back your position at any time until 2 minutes before expiry to either cut your losses, or take your profits early')}</li>
                            <li>{it.L('{JAPAN ONLY}You can see the real-time value of your portfolio and access the trade view and analysis screen from which you can then choose to close the position:')}</li>
                        </ul>
                        <div className='gr-padding-10'>
                            <img className='responsive' src={it.url_for('images/pages/why-us-jp/portfolio.png')} />
                        </div>
                    </Section>
                    <Section id='section-four' header={it.L('{JAPAN ONLY}Your funds are safe')}>
                        <p>{it.L('{JAPAN ONLY}[_1] is fully licensed and regulated by the FFAJ, which requires us to maintain and report a safe level of operating capital.', it.website_name)}</p>
                        <p>{it.L('{JAPAN ONLY}Matters to attend:')}</p>
                        <ul>
                            <li>{it.L('{JAPAN ONLY}By law we are required to manage the assets of our customers and our company separately')}</li>
                            <li>{it.L('{JAPAN ONLY}Segregate all customers\' money to a trust account')}</li>
                            <li>{it.L('{JAPAN ONLY}In the event of our bankruptcy, your assets will be safeguarded by Japan Securities Finance Trust & Banking Company Ltd')}</li>
                            <li>{it.L('{JAPAN ONLY}Distributed back to you by the direction of the beneficiary agent (B)')}</li>
                            <li>{it.L('{JAPAN ONLY}Our internal management control officer and beneficiary representative is required to confirm the amount of funds that must be held in the trust bank count every day')}</li>
                            <li>{it.L('{JAPAN ONLY}The beneficiary agent (B), who is an external lawyer, is bound to perform this function in the event that our Company is not able to return your funds directly')}</li>
                        </ul>
                        <div className='gr-padding-10'>
                            <img className='responsive' src={it.url_for('images/pages/why-us-jp/fund_safe.svg')} />
                        </div>
                    </Section>
                    <Section id='section-five' header={it.L('Our track-record')}>
                        <p>{it.L('{JAPAN ONLY}[_1] was one of the first active Binary Options brokers and has a proven track record of delivering first class service and maintaining an award winning trading platform, while delivering strong financial performance to our shareholders, for more than 15 years worldwide.', it.website_name)}</p>
                        <p>{it.L('{JAPAN ONLY}We pride ourselves on our responsible trading and high ethical standards, and we only offer our service in jurisdictions where we hold the necessary licenses and legal registrations.')}</p>
                        <p>{it.L('{JAPAN ONLY}As well as our Japanese financial licence, we also operate in European jurisdictions with our Malta Financial Services Type 3 Licence, and under various gaming licences around the world.')}</p>
                        <div className='hint'>
                            <p>{it.L('{JAPAN ONLY}Please note:')}</p>
                            <p>{it.L('{JAPAN ONLY}If the market price has changed significantly it may not be possible to execute a trade at a delayed price displayed in a customer\'s browser. Alternatively you may pay a lower price for the option if the price has moved quickly in that direction. Please see our summary of specifications document for full details of our \'slippage\' rules.')}</p>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default WhyUs;
