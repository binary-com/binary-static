import React from 'react';
import Layout from './_common/layout.jsx';

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
            <div className={`${icon_1} icon-sm`} />
            <div className={`${icon_2} icon-sm`} />
        </div>
        <h3 className='center-text uppercase-text gr-padding-10'>{header}</h3>
        <p>{description}</p>
        <div className='gr-row gr-row-align-center'>
            <div className='gr-3 gr-8-m tab-image'>
                <img className='responsive' src={it.url_for(`images/japan/version2/chart/${image_1}.svg`)} />
            </div>
            <div className='gr-12-m gr-padding-10' />
            <div className='gr-3 gr-8-m tab-image'>
                <img className='responsive' src={it.url_for(`images/japan/version2/chart/${image_2}.svg`)} />
            </div>
        </div>
        <p>{duration}</p>
    </div>
);

const BinaryJapan2 = () => (
    <Layout
        css_files={[
            it.url_for('css/japan_2.css'),
            'https://style.binary.com/binary.css',
        ]}
        js_files={[
            'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.js',
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/japan_2.js'),
        ]}
    >
        <div className='navbar-fixed-top' role='navigation' id='navigation'>
            <div className='container'>
                <div className='navbar-header'>
                    <span id='toggle-menu' href='button' className='navbar-toggle' />
                    <a className='navbar-brand logo' href={it.url_for('home')} />
                </div>
                <div className='navbar-collapse'>
                    <ul className='nav navbar-nav'>
                        <li className='invisible'>
                            <a href='#page-top' />
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
                        <div className='gr-6 gr-11-p gr-12-m'>
                            <h3 className='intro-subtext'>{it.L('{JAPAN ONLY}Now you can trade the FX market with binary options with one of the original settlers Binary options around the world')}</h3>
                            <form id='email_top' className='signup-form' noValidate>
                                <div className='signup-form-input'>
                                    <div className='input-group'>
                                        <input autoComplete='off' name='email' id='email' maxLength='50' type='email' placeholder={it.L('{JAPAN ONLY}Enter your email')} />
                                        <div className='invisible center-text error-msg error_validate_email'>{it.L('Invalid email address')}</div>
                                        <div className='invisible center-text error-msg error_no_email'>{it.L('This field is required.')}</div>
                                        <button type='submit' id='btn-submit-email'><span>{it.L('{JAPAN ONLY}Account Opening')}</span></button>
                                    </div>
                                </div>
                                <div className='signup-form-success invisible'>
                                    <p>{it.L('{JAPAN ONLY}Thank you for signing up! Please check your email to complete the registration process.')}</p>
                                </div>
                                <div className='signup-form-error invisible'>
                                    <p>{it.L('{JAPAN ONLY}Sorry, account signup is not available in your country.')}</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='intro-bg' />
            <div className='primary-bg-color-dark' />
        </section>

        <section className='bg-white edge--top edge--bottom--reverse'>
            <div className='container edge--top edge--bottom-reverse tab-container white-gap-before white-gap-after'>
                <div className='tab-with-buttons'>
                    <div className='twb-content-wrapper'>
                        <div className='twb-content-container'>
                            <Product
                                icon_1='ic-1'
                                icon_2='ic-2'
                                image_1='higher-lower-1'
                                image_2='higher-lower-2'
                                header={it.L('{JAPAN ONLY}Ladder Options')}
                                description={it.L('{JAPAN ONLY}Predict whether a FX rate will finish higher or lower than a target barrier.')}
                                duration={it.L('{JAPAN ONLY}2 hours to 1 year terms')}
                            />

                            <Product
                                icon_1='ic-3'
                                icon_2='ic-4'
                                image_1='touch-notouch-1'
                                image_2='touch-notouch-2'
                                header={it.L('{JAPAN ONLY}Touch Options')}
                                description={it.L('{JAPAN ONLY}Predict whether a FX rate will touch a target barrier or not.')}
                                duration={it.L('{JAPAN ONLY}1 week to 1 year terms')}
                            />

                            <Product
                                icon_1='ic-5'
                                icon_2='ic-6'
                                image_1='in-out-1'
                                image_2='in-out-2'
                                header={it.L('{JAPAN ONLY}Range Options: End-In / End-Out')}
                                description={it.L('{JAPANY ONLY}Predict whether a FX rate will end inside or outside a certain range.')}
                                duration={it.L('{JAPAN ONLY}1 week to 1 year terms')}
                            />

                            <Product
                                icon_1='ic-7'
                                icon_2='ic-8'
                                image_1='in-out-3'
                                image_2='in-out-4'
                                header={it.L('{JAPAN ONLY}Range Options: Stay-In / Break-Out')}
                                description={it.L('{JAPAN ONLY}Predict whether a FX rate will touch either target barrier before expiry.')}
                                duration={it.L('{JAPAN ONLY}1 week to 1 year terms')}
                            />
                        </div>
                    </div>
                    <div className='twb-buttons' />
                </div>
            </div>
        </section>

        <section className='bg-orange bg-lines'>
            <div className='container padding-top-bottom-500'>
                <div id='key-plus' className='section-title center-text'>
                    <h2 className='content-inverse-color'>{it.L('{JAPAN ONLY}Key plus point')}</h2>
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
                    <h2 className='color-blue'>{it.L('{JAPAN ONLY}Why choose binary options over foreign exchange')}</h2>
                    <p>{it.L('{JAPAN ONLY}The binary option can provide profit opportunities even at a small price range. Here is a table comparison of foreign exchange and binary options')}</p>
                </div>
                <div className='gr-row cards'>
                    <div className='gr-6 gr-10-p gr-12-m gr-centered'>
                        <div className='card'>
                            <div className='card-header__bubble'>
                                <h3>{it.L('{JAPAN ONLY}Foreign exchange one cancellation order - profit take & stop-loss order')}</h3>
                            </div>
                            <div className='card-body fixed-height'>
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
                                <span className='card-divider' />
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}1 lot = $ 100,000, margin: ')}</p>
                                <p className='size-2 big-spacing'>{it.L('{JAPAN ONLY}Profit / loss per point (0.01) = ¥ 1,000')}</p>
                                <p className='bg-gray size-3'>{it.L('{JAPAN ONLY}1 lot: Stop loss: - ¥ 10,000 | Get profit: ¥ 15,000')}</p>
                                <div className='flex'>
                                    <img className='icon-md' src={it.url_for('images/japan/version1/sad-face.svg')} />
                                    <p className='color-light-blue'>{it.L('{JAPAN ONLY}Margin: ¥ 442,000')}<br/>{it.L('{JAPAN ONLY}Maximum loss: not guaranteed')}</p>
                                </div>
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}$ 100,000 x 110.50 (USD / JPY) x 4% (margin calculation) = ¥ 442,000')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-6 gr-10-p gr-12-m gr-centered'>
                        <div className='card'>
                            <div className='card-header__bubble'>
                                <h3>{it.L('{JAPAN ONLY}Binary option can make a higher profit, for the same risk but less margin')}</h3>
                            </div>
                            <div className='card-body fixed-height'>
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
                                <span className='card-divider' />
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}If spot rate is at above target rate at judgment time, the profil will be:')}</p>
                                <p className='size-2 fixed-width'>{it.L('{JAPAN ONLY}Option price assumes 1 hour to judgment time, volatility = 8.5%, spread = 40 yen')}</p>
                                <p className='bg-gray size-3'>{it.L('{JAPAN ONLY}50 lots: maximum loss: - ¥ 10,000 | target profit: ¥ 40,000')}</p>
                                <div className='flex'>
                                    <img className='icon-md' src={it.url_for('images/japan/version1/happy-face.svg')} />
                                    <p className='color-red'>{it.L('{JAPAN ONLY}Margin: ¥ 10,000')}<br />{it.L('{JAPAN ONLY}Maximum loss: guaranteed')}</p>
                                </div>
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}50 x ￥1,000 - 50 x ￥200 = ￥50,000 - ￥10,000 = ￥40,000')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='bg-white edge--top edge--bottom'>
            <div className='bg-platforms' />
            <div className='container center-text padding-bottom-50'>
                <div className='section-title'>
                    <h2 className='color-blue'>{it.L('{JAPAN ONLY}Available on desktop and mobile platforms')}</h2>
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
                    <h2 className='content-inverse-color'>{it.L('{JAPAN ONLY}Academy')}</h2>
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
                    <h2 className='color-blue'>{it.L('{JAPAN ONLY}Your funds are kept safe')}</h2>
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
                <div className='gr-12 gr-centered'>
                    <div className='section-title'>
                        <h2 className='color-blue'>{it.L('{JAPAN ONLY}How to open an account')}</h2>
                    </div>
                    <div className='gr-row numbered'>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-new-account' />
                                <p className='desc-text'>{it.L('{JAPAN ONLY}Apply for an account & provide ID')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-knowledge-test' />
                                <p className='desc-text'>{it.L('{JAPAN ONLY}Pass our Knowledge Test')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-secure-email' />
                                <p className='desc-text'>{it.L('{JAPAN ONLY}Receive account activation code by secure mail and activate account')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='flex-inline'>
                                <span className='icon-md rounded ic-deposit-money' />
                                <p className='desc-text'>{it.L('{JAPAN ONLY}Deposit funds and begin trading')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='fill-bg-color'>
            <div className='container center-text padding-bottom-50'>
                <div className='section-title'>
                    <h2 className='color-blue'>{it.L('{JAPAN ONLY}Why choose us')}</h2>
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
                        <form id='email_bottom' className='signup-form' noValidate>
                            <h2 className='email'>{it.L('{JAPAN ONLY}Sign up for a free account')}</h2>
                            <div className='signup-form-input center'>
                                <div className='input-group'>
                                    <input autoComplete='off' name='email' id='email' maxLength='50' type='email' placeholder={it.L('{JAPAN ONLY}Enter your email')} />
                                    <div className='invisible center-text error-msg error_validate_email'>{it.L('Invalid email address')}</div>
                                    <div className='invisible center-text error-msg error_no_email'>{it.L('This field is required.')}</div>
                                    <button type='submit' id='btn-submit-email'><span>{it.L('{JAPAN ONLY}Account Opening')}</span></button>
                                </div>
                            </div>
                            <div className='signup-form-success white invisible'>
                                <p>{it.L('{JAPAN ONLY}Thank you for signing up! Please check your email to complete the registration process.')}</p>
                            </div>
                            <div className='signup-form-error white invisible'>
                                <p>{it.L('{JAPAN ONLY}Sorry, account signup is not available in your country.')}</p>
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
            <div className='gr-padding-30 fill-bg-color'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-8 gr-12-p gr-12-m'>
                            <p className='black-text'>{it.L('{JAPAN ONLY}Footer text here')}</p>
                        </div>
                        <div className='gr-4 gr-12-p gr-12-m'>
                            <div className='badges'>
                                <a href='http://www.ffaj.or.jp/index.html' target='_blank' rel='noopener noreferrer'>
                                    <img className='tffa-badge' src={it.url_for('images/pages/regulation/binarykk-logo.gif')} />
                                </a>
                                <a href='http://www.fsa.go.jp/index.html' target='_blank' rel='noopener noreferrer'>
                                    <img className='fsa-badge' src={it.url_for('images/pages/regulation/fsa-logo.png')} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        <div id='affiliate_disclaimer_popup' />
    </Layout>
);

export default BinaryJapan2;
