import React from 'react';
import Title from '../_common/components/title.jsx';
import AntiClickjack from '../_common/includes/anti_clickjack.jsx';
import Favicons from '../_common/includes/favicons.jsx';

const Product = ({
    header,
    description,
    icon_1,
    icon_2,
    image_1,
    image_2,
    duration,
}) => (
    <div className='twb-content'>
        <div className='gr-row gr-row-align-center'>
            <div className={`${icon_1} icon-sm`}></div>
            <div className={`${icon_2} icon-sm`}></div>
        </div>
        <h3 className='center-text gr-padding-10'>{header}</h3>
        <p>{description}</p>
        <div className='gr-row gr-row-align-center'>
            <div className='gr-3 gr-8-m tab-image'>
                <img className='responsive' src={it.url_for(`images/japan/version2/chart/${image_1}.svg`)} />
            </div>
            <div className='gr-12-m gr-padding-10'></div>
            <div className='gr-3 gr-8-m tab-image'>
                <img className='responsive' src={it.url_for(`images/japan/version2/chart/${image_2}.svg`)} />
            </div>
        </div>
        <p>{duration}</p>
    </div>
);

const BinaryJapan2 = () => (
    <html>
        <head>
            <AntiClickjack />

            <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
            <meta httpEquiv='Content-Language' content={it.language} />
            <meta name='description' content={`${it.broker_name} gives everyone an easy way to participate in the financial markets. Trade with as little as $1 USD on major currencies, stocks, indices, and commodities.`} />
            <meta name='keywords' content='binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading' />
            <meta name='author' content={it.broker_name} />
            <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
            <meta name='dcterms.rightsHolder' content={it.broker_name} />
            <meta name='dcterms.rights' content={it.broker_name} />
            <meta property='og:title' content={it.broker_name} />
            <meta property='og:type' content='website' />
            <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />

            <Title />

            <Favicons />

            <link href={`${it.url_for('css/japan_2.css')}?${it.static_hash}`} rel='stylesheet' />
            <link href={`https://style.binary.com/binary.css?${it.static_hash}`} rel='stylesheet' />
        </head>

        <body>
            <div className='navbar-fixed-top' role='navigation' id='navigation'>
                <div className='container'>
                    <div className='navbar-header'>
                        <span id='toggle-menu' href='button' className='navbar-toggle'></span>
                        <a className='navbar-brand logo' href={it.url_for('home')}></a>
                    </div>
                    <div className='navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            <li className='invisible'>
                                <a href='#page-top'></a>
                            </li>
                            <li>
                                <a href='#key-plus' className='page-scroll'>{it.L('{JAPAN ONLY}Key plus points')}</a>
                            </li>
                            <li>
                                <a href='#bo-vs-fx' className='page-scroll'>{it.L('{JAPAN ONLY}Binary Options vs FX')}</a>
                            </li>
                            <li>
                                <a href='#academy' className='page-scroll'>{it.L('{JAPAN ONLY}Academy')}</a>
                            </li>
                            <li>
                                <a href='#open-account' className='page-scroll'>{it.L('{JAPAN ONLY}How to open account')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section id='page-top' className='intro'>
                <div className='container'>
                    <div className='intro-body'>
                        <div className='gr-row'>
                            <div className='gr-6 gr-12-m'>
                                <h2 className='intro-subtext'>{it.L('{JAPAN ONLY}Now you can trade the FX market with binary options with one of the original settlers Binary options around the world')}</h2>
                                <form className='signup-form'>
                                    <div className='signup-form-input'>
                                        <div className='input-group'>
                                            <input autoComplete='off' name='email' id='email' maxLength='50' type='email' placeholder={it.L('{JAPAN ONLY}Enter your email')} />
                                            <span className='error-msg center-text invisible'>{it.L('{JAPAN ONLY}This field is required')}</span>
                                            <button type='submit' id='btn-submit-email'><span>{it.L('{JAPAN ONLY}Account Opening')}</span></button>
                                        </div>
                                    </div>
                                    <div className='signup-form-success invisible'>
                                        <p>{it.L('{JAPAN ONLY}Thank you for signing up! Please check your email to complete the registration process.')}</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='intro-bg'></div>
                <div className='primary-bg-color-dark'></div>
            </section>

            <section className='bg-white edge--top edge--bottom--reverse'>
                <div className='container edge--top edge--bottom-reverse tab-container white-gap-before white-gap-after'>
                    <div className='tab-with-buttons'>
                        <div className='twb-content-wrapper'>
                            <div className='twb-content-container'>
                                <Product icon_1='ic-1' icon_2='ic-2'
                                    image_1='higher-lower-1' image_2='higher-lower-2'
                                    header={it.L('{JAPAN ONLY}Ladder Options')}
                                    description={it.L('{JAPAN ONLY}Predict whether a FX rate will finish higher or lower than a target barrier.')}
                                    duration={it.L('{JAPAN ONLY}2 hours to 1 year terms')} />

                                <Product icon_1='ic-3' icon_2='ic-4'
                                    image_1='touch-notouch-1' image_2='touch-notouch-2'
                                    header={it.L('{JAPAN ONLY}Touch Options')}
                                    description={it.L('{JAPAN ONLY}Predict whether a FX rate will touch a target barrier or not.')}
                                    duration={it.L('{JAPAN ONLY}1 week to 1 year terms')} />

                                <Product icon_1='ic-5' icon_2='ic-6'
                                    image_1='in-out-1' image_2='in-out-2'
                                    header={it.L('{JAPAN ONLY}Range Options: End-In / End-Out')}
                                    description={it.L('{JAPANY ONLY}Predict whether a FX rate will end inside or outside a certain range.')}
                                    duration={it.L('{JAPAN ONLY}1 week to 1 year terms')} />

                                <Product icon_1='ic-3' icon_2='ic-4'
                                    image_1='in-out-3' image_2='in-out-4'
                                    header={it.L('{JAPAN ONLY}Range Options: Stay-In / Break-Out')}
                                    description={it.L('{JAPAN ONLY}Predict whether a FX rate will touch either target barrier before expiry.')}
                                    duration={it.L('{JAPAN ONLY}1 week to 1 year terms')} />
                            </div>
                        </div>
                        <div className='twb-buttons'></div>
                    </div>
                </div>
            </section>

            <section className='bg-orange bg-lines'>
                <div className='container padding-top-bottom-500'>
                    <div id='key-plus' className='section-title center-text'>
                        <h1 className='content-inverse-color'>{it.L('{JAPAN ONLY}Key plus point')}</h1>
                        <p className='content-inverse-color'>{it.L('{JAPAN ONLY}Here are some random texts.')}</p>
                    </div>
                    <div className='cards cards--numbered cards--less-margin gr-row'>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}trade with 50 yen to 999 yen')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}set daily loss limit')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}no transaction fees')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}trade 9 currencies')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}4 options types')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-6-m'>
                            <div className='card-leaf'>
                                <p>{it.L('{JAPAN ONLY}trading periods from 2 hours to 1 year')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id='bo-vs-fx' className='fill-bg-color edge--top'>
                <div className='container padding-bottom-500'>
                    <div className='section-title center-text'>
                        <h1 className='color-blue'>{it.L('{JAPAN ONLY}Why choose binary options over foreign exchange')}</h1>
                        <p>{it.L('{JAPAN ONLY}The binary option can provide profit opportunities even at a small price range. Here is a table comparison of foreign exchange and binary options')}</p>
                    </div>
                    <div className='gr-row cards'>
                        <div className='gr-6 gr-12-m'>
                            <div className='card'>
                                <div className='card-header__bubble'>
                                    <h3>{it.L('{JAPAN ONLY}Foreign exchange one cancellation order - profit take & stop-loss order')}</h3>
                                </div>
                                <div className='card-body'>
                                    <div className='gr-row gr-row-align-center-m gr-row-align-between'>
                                        <div className='box-o'>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/jpy.svg')} />
                                            <span className='size-3'>{it.L('{JAPAN ONLY}¥110.50 / lot')}</span>
                                        </div>
                                        <div className='box'>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/clock.svg')} />
                                            <span className='size-3'>{it.L('{JAPAN ONLY}1 hour')}</span>
                                        </div>
                                    </div>
                                    <div className='flex gr-padding-30'>
                                        <div className='box'>
                                            <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}spot')}</p>
                                            <p>{it.L('{JAPAN ONLY}1 lot')}</p>
                                        </div>
                                        <div>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/ic_arrow_up.svg')} />
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/ic_arrow_down.svg')} />
                                        </div>
                                        <div>
                                            <div className='box'>
                                                <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}profit take sell')}</p>
                                                <p className='color-red'>{it.L('{JAPAN ONLY}¥110.65')}</p>
                                            </div>
                                            <div className='box'>
                                                <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}stop-loss sell')}</p>
                                                <p className='color-light-blue'>{it.L('{JAPAN ONLY}¥110.40')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className='card-divider'></span>
                                    <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}1 lot = $ 100,000, margin: ')}</p>
                                    <p className='size-2'>{it.L('{JAPAN ONLY}Profit / loss per point (0.01) = ¥ 1,000')}</p>
                                    <p className='bg-gray size-3'>{it.L('{JAPAN ONLY}1 lot: Stop loss: - ¥ 10,000 | Get profit: ¥ 15,000')}</p>
                                    <div className='flex'>
                                        <img className='icon-md' src={it.url_for('images/japan/version1/sad-face.svg')} />
                                        <p className='color-light-blue'>{it.L('{JAPAN ONLY}Margin: ¥ 442,000')}<br/>{it.L('{JAPAN ONLY}Maximum loss: not guaranteed')}</p>
                                    </div>
                                    <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}$ 100,000 x 110.50 (USD / JPY) x 4% (margin calculation) = ¥ 442,000')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='card'>
                                <div className='card-header__bubble'>
                                    <h3>{it.L('{JAPAN ONLY}Binary option can make a higher profit, for the same risk but less margin')}</h3>
                                </div>
                                <div className='card-body'>
                                    <div className='gr-row gr-row-align-center-m gr-row-align-between'>
                                        <div className='box-o'>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/jpy.svg')} />
                                            <span className='size-3'>{it.L('{JAPAN ONLY}¥200 /  lot')}</span>
                                        </div>
                                        <div className='box'>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/clock.svg')} />
                                            <span className='size-3'>{it.L('{JAPAN ONLY}1 hour')}</span>
                                        </div>
                                    </div>
                                    <div className='flex gr-padding-30'>
                                        <div className='box'>
                                            <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}call option buy')}</p>
                                            <p>{it.L('{JAPAN ONLY}50ロット')}</p>
                                        </div>
                                        <div>
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/ic_arrow_up.svg')} />
                                            <img className='icon-sm' src={it.url_for('images/japan/version1/ic_arrow_down.svg')} />
                                        </div>
                                        <div>
                                            <div className='box'>
                                                <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}payout (if spot 110.65 or higher)')}</p>
                                                <p className='color-red'>{it.L('{JAPAN ONLY}¥1,000')}</p>
                                            </div>
                                            <div className='box'>
                                                <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}if not')}</p>
                                                <p className='color-light-blue'>{it.L('{JAPAN ONLY}¥0')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className='card-divider'></span>
                                    <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}If spot rate is at above target rate at judgment time, the profil will be:')}</p>
                                    <p className='size-2'>{it.L('{JAPAN ONLY}Option price assumes 1 hour to judgment time, volatility = 8.5%, spread = 40 yen')}</p>
                                    <p className='bg-gray size-3'>{it.L('{JAPAN ONLY}50 lots: maximum loss: - ¥ 10,000 | target profit: ¥ 40,000')}</p>
                                    <div className='flex'>
                                        <img className='icon-md' src={it.url_for('images/japan/version1/happy-face.svg')} />
                                        <p className='color-red'>{it.L('{JAPAN ONLY}Margin: ¥ 10,000')}<br />{it.L('{JAPAN ONLY}Maximum loss: guaranteed')}</p>
                                    </div>
                                    <p className='size-1 color-gray'>{it.L('{JAPAN ONLY}50 x ￥1,000 - 50 x ￥200 = ￥50,000 - ￥10,000 = ￥40,000')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-white edge--top edge--bottom'>
                <div className='bg-platforms'></div>
                <div className='container center-text padding-bottom-50'>
                    <div className='section-title'>
                        <h1 className='color-blue'>{it.L('{JAPAN ONLY}Available on desktop and mobile platforms')}</h1>
                        <p>{it.L('{JAPAN ONLY}Here are some random texts.')}</p>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <img className='responsive bg-overflow' src={it.url_for('images/japan/version2/img-devices@2x.png')} />
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-orange bg-confetti'>
                <div className='container center-text padding-top-bottom-500'>
                    <div id='academy' className='section-title content-inverse-color'>
                        <h1 className='content-inverse-color'>{it.L('{JAPAN ONLY}Academy')}</h1>
                        <p>{it.L('{JAPAN ONLY}Learn to become a better trader and get all the latest news and trends on financial transactions for free.')}</p>
                    </div>
                    <div className='gr-row content-inverse-color'>
                        <div className='gr-3 gr-6-m'>
                            <img className='icon-lg' src={it.url_for('images/japan/version2/ic-webinar-2.svg')} />
                            <p>{it.L('{JAPAN ONLY}Interactive webinar')}</p>
                        </div>
                        <div className='gr-3 gr-6-m'>
                            <img className='icon-lg' src={it.url_for('images/japan/version2/ic-marketreport-2.svg')} />
                            <p>{it.L('{JAPAN ONLY}Daily market report')}</p>
                        </div>
                        <div className='gr-3 gr-6-m'>
                            <img className='icon-lg' src={it.url_for('images/japan/version2/ic-ebook-video-2.svg')} />
                            <p>{it.L('{JAPAN ONLY}E-book and video')}</p>
                        </div>
                        <div className='gr-3 gr-6-m'>
                            <img className='icon-lg' src={it.url_for('images/japan/version2/ic-practice-account-2.svg')} />
                            <p>{it.L('{JAPAN ONLY}Practice account')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='fill-bg-color edge--top--reverse'>
                <div className='container center-text padding-bottom-500 override'>
                    <div className='section-title'>
                        <h1 className='color-blue'>{it.L('{JAPAN ONLY}Your funds are kept safe')}</h1>
                        <p>{it.L('{JAPAN ONLY}All customer funds are deposited with JSF Trust Bank and will be refunded by an independent attorney as a beneficiary agent in case of business failure')}</p>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m gr-centered box-divider'>
                            <img className='responsive fundsafe' src={it.url_for('images/japan/version2/img-fundsafe-left.svg')} />
                        </div>
                        <div className='gr-6 gr-12-m gr-centered'>
                            <img className='responsive fundsafe' src={it.url_for('images/japan/version2/img-fundsafe-right.svg')} />
                        </div>
                    </div>
                </div>
            </section>

            <section id='open-account' className='bg-white edge--top--reverse'>
                <div className='container center-text padding-bottom-50 override small-gap-before'>
                    <div className='section-title'>
                        <h1 className='color-blue'>{it.L('{JAPAN ONLY}How to open an account')}</h1>
                    </div>
                    <div className='gr-row numbered'>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-new-account'></span>
                                <p>{it.L('{JAPAN ONLY}Apply for an account & provide ID')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-knowledge-test'></span>
                                <p>{it.L('{JAPAN ONLY}Pass our Knowledge Test')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-secure-email'></span>
                                <p>{it.L('{JAPAN ONLY}Receive account activation code by secure mail and activate account')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-deposit-money'></span>
                                <p>{it.L('{JAPAN ONLY}Deposit funds and begin trading')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='fill-bg-color'>
                <div className='container center-text padding-bottom-50'>
                    <div className='section-title'>
                        <h1 className='color-blue'>{it.L('{JAPAN ONLY}Why choose us')}</h1>
                        <p>{it.L('{JAPAN ONLY}[_1] is a pioneer in the award-winning online option deal.', it.website_name)}</p>
                    </div>
                    <img className='ic-award' src={it.url_for('images/japan/version2/img-award-1.svg')} />
                    <img className='ic-award' src={it.url_for('images/japan/version2/img-award-2@2x.png')} />
                    <img className='ic-award' src={it.url_for('images/japan/version2/img-award-3@2x.png')} />
                    <img className='ic-award' src={it.url_for('images/japan/version2/img-award-4@2x.png')} />
                </div>
            </section>

            <div className='bg-orange bg-semicircles'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <form className='signup-form'>
                                <h1 className=''>{it.L('{JAPAN ONLY}Sign up for a free account')}</h1>
                                <div className='signup-form-input'>
                                    <div className='input-group'>
                                        <input autoComplete='off' name='email' id='email' maxLength='50' type='email' placeholder={it.L('{JAPAN ONLY}Enter your email')} />
                                        <span className='error-msg center-text invisible'>{it.L('{JAPAN ONLY}This field is required')}</span>
                                        <button type='submit' id='btn-submit-email'><span>{it.L('{JAPAN ONLY}Account Opening')}</span></button>
                                    </div>
                                </div>
                                <div className='signup-form-success white invisible'>
                                    <p>{it.L('{JAPAN ONLY}Thank you for signing up! Please check your email to complete the registration process.')}</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <footer className='content-inverse-color'>
                <div className='primary-bg-color'>
                    <div className='container'>
                        <p>{it.L('{JAPAN ONLY}Disclaimer text here')}</p>
                    </div>
                </div>
                <div className='primary-bg-color-dark'>
                    <div className='container'>
                        <p>{it.L('{JAPAN ONLY}Footer text here')}</p>
                    </div>
                </div>
            </footer>

            <script src={`${it.url_for('js/landing_pages/common.js')}?${it.static_hash}`}></script>
            <script src={`${it.url_for('js/landing_pages/japan_2.js')}?${it.static_hash}`}></script>
        </body>
    </html>
);

export default BinaryJapan2;
