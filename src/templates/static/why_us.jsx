import React from 'react';
import { List } from '../_common/components/elements.jsx';

const Section = ({ className = '', id, header, children }) => (
    <div className={`section ${className}`}>
        <a id={id} />
        <div className='section-content'>
            <h1>{header}</h1>
            {children}
        </div>
    </div>
);

const WhyUs = () => (
    <div className='container'>
        <div className='why-us static_full gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'sidebar-link-section-1', href: '#sharp-prices',         text: it.L('Sharp prices'), className: 'selected'},
                            { id: 'sidebar-link-section-2', href: '#flexible-trades',      text: it.L('Flexible trades')},
                            { id: 'sidebar-link-section-3', href: '#controlled-risk',      text: it.L('Controlled risk')},
                            { id: 'sidebar-link-section-4', href: '#power-and-simplicity', text: it.L('Power & simplicity')},
                            { id: 'sidebar-link-section-5', href: '#security',             text: it.L('Security'),     className: 'id-hide'},
                            { id: 'sidebar-link-section-6', href: '#trust',                text: it.L('Trust')},
                        ]}
                    />
                    <div className='center-text gr-padding-10 client_logged_out invisible'>
                        <a className='button' href={it.url_for('/')}>
                            <span>{it.L('Open a free account')}</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className='gr-9 gr-12-m gr-parent'>
                <Section id='sharp-prices' header={it.L('Why pay more?')}>
                    <p>{it.L('[_1]\'s patented pricing technology allows you to benefit from the same rates of return as traders in the interbank market.', it.website_name)}</p>
                    <div className='gr-row'>
                        <div className='gr-7 gr-12-m'>
                            <ul className='checked'>
                                <li>{it.L('Real-time prices, benchmarked against interbank options markets.')}</li>
                                <li>{it.L('Returns above 100% on simple <a href=\'[_1]\'>rise/fall</a> contracts.', it.url_for('trading?market=forex&formname=risefall'))}</li>
                                <li>{it.L('Returns above 1000% on <a href=\'[_1]\'>higher/lower</a> and <a href=\'[_2]\'>touch/no-touch</a> trades.', it.url_for('trading?market=forex&formname=higherlower'), it.url_for('trading?market=forex&formname=touchnotouch'))}</li>
                                <li>{it.L('No hidden fees or commissions.')}</li>
                            </ul>
                        </div>
                        <div className='gr-5 gr-10-m gr-centered-m'>
                            <img className='responsive' src={it.url_for('images/pages/why-us/why-us-sharp-prices.png')} />
                        </div>
                    </div>
                </Section>

                <Section id='flexible-trades' header={it.L('Trade your way')}>
                    <p>{it.L('Why limit yourself? Whatever your market view, [_1] allows you to put your strategy to work and profit from your predictions.', it.website_name)}</p>
                    <img className='responsive' src={it.url_for('images/pages/tour/trade-tutorial_1.svg')} />
                    <ul className='checked'>
                        <li>{it.L('Choose a payout from $1 to $50,000.')}</li>
                        <li>{it.L('Trade all major currencies, indices, stocks, and commodities.')}</li>
                        <li>{it.L('Choose a duration from 10 seconds to 365 days.')}</li>
                        <li>{it.L('Choose your own strike.')}</li>
                    </ul>
                </Section>

                <Section id='controlled-risk' header={it.L('Know what you stand to win or lose')}>
                    <div className='gr-row'>
                        <div className='gr-7 gr-12-m'>
                            <p>{it.L('With [_1], you’ll know the risk and potential reward before you purchase a contract.', it.website_name)}</p>
                            <ul className='checked'>
                                <li>{it.L('Choose a payout and our system will calculate the stake required to purchase the contract.')}</li>
                                <li>{it.L('You risk only your initial stake, and your stake never increases.')}</li>
                                <li>{it.L('You can sell your contract before expiry to keep any profit you may have made or to minimise your loss.')}</li>
                            </ul>
                        </div>
                        <div className='gr-5 gr-8-m gr-centered-m gr-padding-20'>
                            <img className='responsive' src={it.url_for('images/pages/why-us/why-us-do-not-lose.svg')} />
                        </div>
                    </div>
                </Section>

                <Section id='power-and-simplicity' header={it.L('One simple platform')}>
                    <p>{it.L('[_1] offers the world\'s financial markets in a simple, user-friendly platform.', it.website_name)}</p>
                    <div className='gr-row gr-padding-10'>
                        <div className='gr-8 gr-12-m gr-parent gr-padding-10'>
                            <img className='responsive' src={it.url_for('images/pages/why-us/simple-platform.svg')} />
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <ul className='checked'>
                                <li>{it.L('Find the right trade for every market condition.')}</li>
                                <li>{it.L('Execute your trade in seconds.')}</li>
                                <li>{it.L('Monitor your portfolio in real time.')}</li>
                                <li>{it.L('Sell back trades at market prices.')}</li>
                            </ul>
                        </div>
                    </div>
                </Section>

                <Section className='id-hide' id='security' header={it.L('Licensed, trusted, and secure')}>
                    <div className='gr-row'>
                        <div className='gr-8 gr-12-m'>
                            <p>{it.L('With [_1], you can count on us to serve you with integrity and reliability.', it.website_name)}</p>
                            <ul className='checked'>
                                <li>{it.L('We have a proven track record since we launched our platform in 2000.')}</li>
                                <li>{it.L('We are licensed and regulated in the British Isles, Japan, and in Malta since 2015.')}</li>
                                <li>{it.L('We segregate your funds and keep them in secure and licensed financial institutions.')}</li>
                            </ul>
                        </div>
                        <div className='gr-4 gr-12-m gr-parent'>
                            <div className='gr-row gr-padding-20'>
                                <div className='gr-11 gr-8-m gr-centered'>
                                    <img className='responsive' src={it.url_for('images/pages/why-us/mga-logo2.svg')} />
                                </div>
                                <div className='gr-parent gr-8-m gr-centered'>
                                    <div className='gr-6 gr-centered-m gr-padding-10'>
                                        <img className='responsive' src={it.url_for('images/pages/why-us/why-us-proven-record_1.svg')} />
                                    </div>
                                    <div className='gr-6 gr-centered-m gr-padding-10'>
                                        <img className='responsive' src={it.url_for('images/pages/footer/isle-of-man.png')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section id='trust' header={it.L('Go with the leader')}>
                    <div className='gr-row'>
                        <div className='gr-2 gr-4-m gr-centered-m gr-padding-20 align-self-center'>
                            <img className='responsive' src={it.url_for('images/pages/home/awards/tw2.svg')} />
                        </div>
                        <div className='gr-2 gr-4-m gr-centered-m gr-padding-20 align-self-center'>
                            <img className='responsive' src={it.url_for('images/pages/home/awards/gbaf.svg')} />
                        </div>
                        <div className='gr-2 gr-4-m gr-centered-m gr-padding-20 align-self-center'>
                            <img className='responsive' src={it.url_for('images/pages/home/awards/menafxpro.svg')} />
                        </div>
                        <div className='gr-2 gr-4-m gr-centered-m gr-padding-20 align-self-center'>
                            <img className='responsive' src={it.url_for('images/pages/home/awards/egr.svg')} />
                        </div>
                        <div className='gr-3 gr-5-m gr-centered-m gr-padding-20 align-self-center'>
                            <img className='responsive' src={it.url_for('images/pages/home/awards/opwa.svg')} />
                        </div>
                    </div>
                    <p>{it.L('[_1] is the award-winning industry pioneer in online options trading. We boast:', it.website_name)}</p>
                    <ul className='checked'>
                        <li>{it.L('Over two billion dollars in trades to date.')}</li>
                        <li>{it.L('First-class client service.')}</li>
                        <li>{it.L('Multi award-winning trading platform.')}</li>
                        <li>{it.L('Exclusive binary trading technology.')}</li>
                    </ul>
                </Section>
            </div>
        </div>
    </div>
);

export default WhyUs;
