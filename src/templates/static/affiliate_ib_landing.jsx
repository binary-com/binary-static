import React             from 'react';
import { Table }         from '../_common/components/elements.jsx';
import PaymentLogo       from '../_common/components/payment_logo.jsx';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs }        from '../_common/components/tabs.jsx';

const ArrowsMobile = ({ direction, parent }) => (
    <div className='align-self-center gr-2 gr-hide gr-show-m gr-no-gutter'>
        <img
            className={`go-${direction} gr-5 gr-no-gutter gr-centered`}
            data-parent={parent}
            src={it.url_for(`images/pages/home/arrow_${direction}.svg`)}
        />
    </div>
);

const AffiliateIBLanding = () => (
    <React.Fragment>
        <section id='page_top' className='hero'>
            <div className='container gr-row gr-padding-20 full-height align-self-center center-text'>
                <div className='gr-10 gr-centered'>
                    <h2 className='hero-header color-white'>{it.L('Build a rewarding and long-term business relationship with an industry pioneer')}</h2>
                    <a href={it.affiliate_signup_url} className='button' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Become our partner')}</span>
                    </a>
                </div>
            </div>
        </section>
        <section className='statistics'>
            <div className='container gr-row full-height full-width gr-row-align-middle center-text gr-padding-20'>
                <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                    <h1>{it.L('40K+')}</h1>
                    <h3>{it.L('Partners')}</h3>
                </article>
                <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                    <h1>{it.L('$12M+')}</h1>
                    <h3>{it.L('Partner earnings')}</h3>
                </article>
                <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                    <h1>{it.L('150+')}</h1>
                    <h3>{it.L('Countries')}</h3>
                </article>
                <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                    <h1>{it.L('1M+')}</h1>
                    <h3>{it.L('Clients')}</h3>
                </article>
            </div>
        </section>
        <section className='type-of-partner primary-bg-color'>
            <div className='container center-text gr-padding-30'>
                <h2>{it.L('The types of partnerships we offer')}</h2>
                <p className='color-white'>{it.L('Depending on what you do, you can apply as our Affiliate or Introducing Broker, or both. More new clients from you means higher potential commissions.')}
                </p>
                <div className='has-tabs'>
                    <ul className='gr-row'>
                        <li className='gr-6'><a href='#affiliate'>{it.L('Affiliate')}</a></li>
                        <li className='gr-6'><a href='#ib'>{it.L('Introducing Broker (IB)')}</a></li>
                    </ul>
                    <div id='affiliate'>
                        <div className='gr-12 white-bg-color'>
                            <p className='gr-padding-20 no-margin'>{it.L('Earn up to 35% in commission by referring new clients to trade on our premier platforms for binary options. All commissions are credited into your account by the 15th of every month.')}</p>
                            <h3 className='secondary-color'>{it.L('Commision structure')}</h3>
                            <TabContainer className='gr-padding-30 gr-parent full-width gr-11 gr-12-m gr-centered' theme='light'>
                                <div className='gr-row gr-hide gr-show-m'>
                                    <ArrowsMobile parent='commission_structure' direction='left' />
                                    <strong id='tab_mobile_header' className='align-self-center gr-8' />
                                    <ArrowsMobile parent='commission_structure' direction='right' />
                                </div>
                                <TabsSubtabs
                                    id='commission_structure'
                                    className='gr-parent tab-selector-wrapper gr-hide-m'
                                    items={[
                                        { id: 'revenue',   text: it.L('Revenue Share') },
                                        { id: 'turnover',  text: it.L('Turnover') },
                                        { id: 'cpa',       text: it.L('CPA (EU only)') },
                                        { id: 'commission_structure_selector', className: 'tab-selector' },
                                    ]}
                                />
                                <div className='tab-content gr-padding-20'>
                                    <TabContentContainer>
                                        <TabContent id='revenue' className='selectedTab'>
                                            <div className='gr-11 gr-12-m gr-centered'>
                                                <p className='no-margin text-align-left'>{it.L('Earn increasingly higher payouts with tiered and laddered commission rates that reward you based on the net revenue generated by your referred clients.')}</p>
                                                <Table
                                                    data={{
                                                        thead: [
                                                            [
                                                                { text: it.L('Tier') },
                                                                { text: it.L('Total net revenue per month (USD)') },
                                                                { text: it.L('Commission rates') },
                                                            ],
                                                        ],
                                                        tbody: [
                                                            [
                                                                { text: '1' },
                                                                { text: '$0 - $10,000' },
                                                                { text: '20%' },
                                                            ],
                                                            [
                                                                { text: '2' },
                                                                { text: '$10,001 – $50,000' },
                                                                { text: '25%' },
                                                            ],
                                                            [
                                                                { text: '3' },
                                                                { text: '$50,001 – $100,000' },
                                                                { text: '30%' },
                                                            ],
                                                            [
                                                                { text: '4' },
                                                                { text: it.L('$100,001 and above') },
                                                                { text: '35%' },
                                                            ],
                                                        ],
                                                    }}
                                                />

                                                <a href={it.affiliate_signup_url} className='button' target='_blank' rel='noopener noreferrer'>
                                                    <span>{it.L('Sign up now')}</span>
                                                </a>
                                            </div>
                                        </TabContent>
                                        <TabContent id='turnover'>
                                            <div className='gr-11 gr-centered'>
                                                <p className='no-margin text-align-left'>{it.L('Our turnover-based commission plan depends on the payout probability for each contract. Contracts with higher returns for the client offer you lower commissions.')}</p>
                                                <Table
                                                    data={{
                                                        thead: [
                                                            [
                                                                { text: it.L('Probability of returns') },
                                                                { text: it.L('Commission rates') },
                                                            ],
                                                        ],
                                                        tbody: [
                                                            [
                                                                { text: '0 – 19.999%' },
                                                                { text: '1.25%' },
                                                            ],
                                                            [
                                                                { text: '20 – 39.999%' },
                                                                { text: '1%' },
                                                            ],
                                                            [
                                                                { text: '40 – 59.999%' },
                                                                { text: '0.75%' },
                                                            ],
                                                            [
                                                                { text: '60 – 79.999%' },
                                                                { text: '5%' },
                                                            ],
                                                            [
                                                                { text: '80 – 94.999%' },
                                                                { text: '0.25%' },
                                                            ],
                                                            [
                                                                { text: '95%+' },
                                                                { text: '0%' },
                                                            ],
                                                        ],
                                                    }}
                                                />
                                            </div>
                                        </TabContent>
                                        <TabContent id='cpa'>
                                            <div className='gr-11 gr-centered text-align-left'>
                                                <h3 className='no-margin'>{it.L('Cost per acquisition (CPA) for EU Affiliates only')}</h3>
                                                <p>{it.L('Earn USD 100 in commission for each successful referral. Your referred client must open a real money investment account through your unique affiliate link and deposit a total of USD 100 or more (one-time or accumulative) in the account. This commission plan is only available to Affiliates based in the EU.')}</p>
                                                <a href={it.affiliate_signup_url} className='button center-text gr-centered gr-padding-20' target='_blank' rel='noopener noreferrer'>
                                                    <span>{it.L('Sign up now')}</span>
                                                </a>
                                            </div>
                                        </TabContent>
                                    </TabContentContainer>
                                </div>
                            </TabContainer>
                        </div>
                    </div>
                    <div id='ib'>
                        <div className='gr-12 gr-padding-20 white-bg-color'>
                            <p className='no-margin'>{it.L('Earn daily commissions on the trading activities of the clients you refer to the [_1] MetaTrader 5 (MT5) platform. Your total commissions will be credited into your account by the end of the day.', it.website_name)}</p>

                            <div className='gr-10 gr-12-m gr-parent gr-centered'>
                                <h3 id='ib-header' className='secondary-color'>{it.L('Commision structure')}</h3>
                                
                                <h3>{it.L('Synthetic Indices Account')}</h3>
                                <Table
                                    data={{
                                        thead: [
                                            [
                                                { text: it.L('Asset'), attributes: { rowSpan: 2 } },
                                                { text: it.L('Commission per round trade') },
                                            ],
                                            [
                                                { text: it.L('$ per USD 100,000 of turnover'), className: 'center-text' },
                                            ],
                                        ],
                                        tbody: [
                                            [
                                                { text: it.L('Crash 1000 Index') },
                                                { text: '0.20' },
                                            ],
                                            [
                                                { text: it.L('Boom 1000 Index') },
                                                { text: '0.20' },
                                            ],
                                            [
                                                { text: it.L('Volatility 100 Index') },
                                                { text: '15.00' },
                                            ],
                                            [
                                                { text: it.L('Volatility 75 Index') },
                                                { text: '10.00' },
                                            ],
                                            [
                                                { text: it.L('Volatility 50 Index') },
                                                { text: '7.50' },
                                            ],
                                            [
                                                { text: it.L('Volatility 25 Index') },
                                                { text: '3.50' },
                                            ],
                                            [
                                                { text: it.L('Volatility 10 Index') },
                                                { text: '1.50' },
                                            ],
                                            [
                                                { text: it.L('HF Volatility 100 Index') },
                                                { text: '15.00' },
                                            ],
                                            [
                                                { text: it.L('HF Volatility 50 Index') },
                                                { text: '7.50' },
                                            ],
                                            [
                                                { text: it.L('HF Volatility 10 Index') },
                                                { text: '1.50' },
                                            ],
                                        ],
                                    }}
                                />

                                <p className='text-align-left'>{it.L('For example, a round trade (i.e. open and close position) of 1 lot of Vol 75 Index for a price of USD 125,000 would pay USD 8.')}</p>
                                <p className='text-align-left'><strong>{it.L('USD 10 X 1 lot x USD 100,000/125,000 = USD 8')}</strong></p>
                                <p className='text-align-left'>{it.L('If your account currency is EUR or GBP, your commission will be converted based on the current forex rate.')}</p>
                                
                                <h3>{it.L('Standard account')}</h3>
                                <Table
                                    data={{
                                        thead: [
                                            [
                                                { text: it.L('Asset'), attributes: { rowSpan: 2 } },
                                                { text: it.L('Commission') },
                                            ],
                                            [
                                                { text: it.L('per lot'), className: 'center-text' },
                                            ],
                                        ],
                                        tbody: [
                                            [
                                                { text: it.L('Forex and metals*') },
                                                { text: '10' },
                                            ],
                                            [
                                                { text: it.L('Cryptocurrencies**') },
                                                { text: '0.3%' },
                                            ],
                                        ],
                                    }}
                                />

                                <h3>{it.L('Advanced account')}</h3>
                                <Table
                                    data={{
                                        thead: [
                                            [
                                                { text: it.L('Asset'), attributes: { rowSpan: 2 } },
                                                { text: it.L('Commission') },
                                            ],
                                            [
                                                { text: it.L('per lot'), className: 'center-text' },
                                            ],
                                        ],
                                        tbody: [
                                            [
                                                { text: it.L('Forex*') },
                                                { text: '5' },
                                            ],
                                        ],
                                    }}
                                />

                                <p className='text-align-left'>*{it.L('Represents the amount in base currency per round trade. For example, a round trade of 1 lot of EUR/USD would pay EUR 10 on standard accounts. A round trade of 1 lot of USD/CAD would pay USD 5 on advanced accounts.')}</p>
                                <p className='text-align-left'>**{it.L('Cryptocurrencies commission per round trade. For example, a round trade of 1 lot of BTC/USD with spot price of USD 10,000 will pay USD 30 on standard accounts.')}</p>
                            </div>

                            <a href={it.affiliate_signup_url} className='button' target='_blank' rel='noopener noreferrer'>
                                <span>{it.L('Sign up now')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='how-it-works'>
            <div className='container center-text gr-padding-20'>
                <h2>{it.L('How it works')}</h2>
                <div className='gr-row'>
                    <div className='gr-4 gr-12-m gr-centered'>
                        <div className='gr-row'>
                            <div className='gr-2 gr-hide-m gr-hide-p' />
                            <div className='gr-8 gr-12-m gr-12-p'>
                                <img src={it.url_for('images/pages/affiliates_ib_landing/icons/signup.svg')} />
                            </div>
                            <div className='gr-2 gr-hide-m gr-hide-p align-self-center'>
                                <img src={it.url_for('images/pages/affiliates_ib_landing/icons/circle_arrow.svg')} />
                            </div>
                        </div>
                        <h3>{it.L('Sign up')}</h3>
                        <p>{it.L('Choose your preferred programme, complete the application form, and receive your affiliate link upon approval.')}</p>
                    </div>
                    <div className='gr-4 gr-12-m gr-centered'>
                        <div className='gr-row'>
                            <div className='gr-1 gr-hide-m gr-hide-p' />
                            <div className='gr-10 gr-12-m gr-12-p'>
                                <img src={it.url_for('images/pages/affiliates_ib_landing/icons/introduce.svg')} />
                            </div>
                            <div className='gr-1 gr-hide-m gr-hide-p align-self-center'>
                                <img src={it.url_for('images/pages/affiliates_ib_landing/icons/circle_arrow.svg')} />
                            </div>
                        </div>
                        <h3>{it.L('Introduce [_1]', it.website_name)}</h3>
                        <p>{it.L('Spread the word to your audience. Use your unique referral link and our tried-and-tested referral tools to drive traffic to [_1].', it.website_name)}</p>
                    </div>
                    <div className='gr-4 gr-12-m gr-centered'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/earn.svg')} />
                        <h3>{it.L('Earn')}</h3>
                        <p>{it.L('Refer new clients to trade with us. Receive commissions based on your chosen partnership programme.')}</p>
                    </div>
                </div>
            </div>
        </section>
        <section className='who-apply'>
            <div className='container gr-padding-20 white-bg-color'>
                <h2 className='center-text'>{it.L('Who can apply as a [_1] partner', it.website_name)}</h2>
                <div className='gr-row center-text-m'>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Webmaster')}</h4>
                        <p>{it.L('Runs and manages a website that promotes forex or binary options')}</p>
                    </div>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Trading guru')}</h4>
                        <p>{it.L('Nurtures a community of potential and existing online traders through insight and mentorship')}</p>
                    </div>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Webinar speaker')}</h4>
                        <p>{it.L('Conducts trading discussions and interactive sessions online with trading enthusiasts')}</p>
                    </div>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Web and software developer')}</h4>
                        <p>{it.L('Builds trading applications and interfaces using the [_1] API', it.website_name)}</p>
                    </div>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Social media admin')}</h4>
                        <p>{it.L('Manages a social media page dedicated to online trading')}</p>
                    </div>
                    <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                        <h4>{it.L('Blogger and vlogger')}</h4>
                        <p>{it.L('Maintains a page or video channel about online trading')}</p>
                    </div>
                    <a href={it.affiliate_signup_url} className='button gr-centered gr-10-m gr-padding-20' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Join our global network of partners now')}</span>
                    </a>
                </div>
            </div>
        </section>
        <section className='why-partner primary-bg-color'>
            <div className='container center-text full-height gr-padding-30'>
                <h2 className='center-text color-white'>{it.L('Why partner with us')}</h2>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/commission.svg')} alt='Generous commissions' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('Generous commissions')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/conversion.svg')} alt='High conversions' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('High conversions')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/payment.svg')} alt='On-time payments' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('On-time payments')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/no-hidden-fees.svg')} alt='No hidden fees' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('No hidden fees')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/contact.svg')} alt='Customer-centric partnership' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('Customer-centric partnership')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/diversify-income.svg')} alt='Multiple income opportunities' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('Multiple income opportunities')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing.svg')} alt='Advanced referral tools' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('Advanced referral tools')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/support-faq.svg')} alt='International support' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('International support')}</h4>
                    </div>
                    <div className='gr-4 gr-padding-10'>
                        <img src={it.url_for('images/pages/affiliates_ib_landing/icons/globe.svg')} alt='Multilingual platforms' className='gr-centered' />
                        <h4 className='secondary-color'>{it.L('Multilingual platforms')}</h4>
                    </div>
                </div>
            </div>
        </section>
        <section className='faq'>
            <div className='container center-text'>
                <h2 className='faq-header'>{it.L('Frequently asked questions')}</h2>

                <div className='gr-row'>
                    <div className='gr-10 gr-12-m gr-12-p gr-centered'>
                        <div className='gr-row'>
                            <div className='gr-6 gr-12-m gr-padding-10'>
                                <div className='faq-item'>
                                    <p className='faq-item-header secondary-color'>{it.L('Affiliate')}</p>

                                    <ul className='faq-item-content'>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg')} alt='General' />
                                            <a href={`${it.url_for('affiliate/faq')}#general`} className='faq-item-content-text'>{it.L('General')}</a>
                                        </li>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg')} alt='Account management' />
                                            <a href={`${it.url_for('affiliate/faq')}#account-management-and-tracking`} className='faq-item-content-text'>{it.L('Account management')}</a>
                                        </li>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg')} alt='Referral tools' />
                                            <a href={`${it.url_for('affiliate/faq')}#referral-tools`} className='faq-item-content-text'>{it.L('Referral tools')}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='gr-6 gr-12-m gr-padding-10'>
                                <div className='faq-item'>
                                    <p className='faq-item-header secondary-color'>{it.L('Introducing Broker')}</p>

                                    <ul className='faq-item-content'>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg')} alt='General' />
                                            <a href={`${it.url_for('ib-programme/ib-faq')}#general`} className='faq-item-content-text'>{it.L('General')}</a>
                                        </li>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg')} alt='Account management' />
                                            <a href={`${it.url_for('ib-programme/ib-faq')}#account-management`} className='faq-item-content-text'>{it.L('Account management')}</a>
                                        </li>
                                        <li>
                                            <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg')} alt='Referral tools' />
                                            <a href={`${it.url_for('ib-programme/ib-faq')}#referral-tools`} className='faq-item-content-text'>{it.L('Referral tools')}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className='faq-message'>{it.L('For further assistance, email us at [_1]affiliates@binary.com[_2]', '<a href="mailto:affiliates@binary.com">', '</a>')}</p>
            </div>
        </section>
        <section className='payment-method white-bg-color'>
            <div className='container center-text full-height gr-padding-30'>
                <h2>{it.L('Receive your earnings through your favourite payment method')}</h2>
                <div className='gr-row gr-row-align-center'>
                    <PaymentLogo />
                </div>
            </div>
        </section>
    </React.Fragment>
);

export default AffiliateIBLanding;
