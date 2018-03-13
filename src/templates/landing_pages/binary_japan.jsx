import React from 'react';
import Layout from './_common/layout.jsx';

const BinaryJapan = () => (
    <Layout
        css_files={[
            it.url_for('css/japan.css'),
            'https://style.binary.com/binary.css',
        ]}
        js_files={[
            'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.js',
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/japan.js'),
        ]}
    >
        <div className='navbar-fixed-top' role='navigation' id='navigation'>
            <div className='container'>
                <div className='navbar-header gr-row'>
                    <div className='gr-6 gr-12-m'>
                        <a className='navbar-item-align-left' href={it.url_for('home')}>
                            <span className='logo' />
                        </a>
                    </div>
                    <div className='gr-6 gr-12-m'>
                        <div className='navbar-item-align-right'>
                            <a href='http://www.ffaj.or.jp/index.html' target='_blank' rel='noopener noreferrer'>
                                <img className='navbar-icon' src={it.url_for('images/japan/version1/fsa-logo@2x.png')} />
                            </a>
                            <a href='http://www.fsa.go.jp/index.html' target='_blank' rel='noopener noreferrer'>
                                <img className='navbar-icon' src={it.url_for('images/japan/version1/binarykk-logo@2x.png')} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section id='page-top' className='intro'>
            <div className='intro-body container'>
                <div className='gr-row gr-row-align-middle gr-row-align-center gr-row-reverse'>
                    <div className='gr-5 gr-10-m'>
                        <img className='responsive' src={it.url_for('images/japan/version1/retro.svg')} />
                    </div>
                    <div className='gr-7 gr-12-m'>
                        <h1 className='intro-text gr-10-m'>{it.L('{JAPAN ONLY}Binary Options', it.website_name)}</h1>
                        <img className='responsive' src={it.url_for('images/japan/version1/pair.svg')} />
                        <h3 className='intro-subtext'>{it.L('{JAPAN ONLY}Now you can trade fx markets using binary options with one of the origical pioneers of binary options worldwide')}</h3>
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
                <h1 className='center-text content-inverse-color intro-bottom-text'>{it.L('{JAPAN ONLY}What are Binary Options?')}</h1>
            </div>
        </section>

        <section className='pattern pattern-wave pattern-stretch spacing'>
            <div className='section-title gr-12-m'>
                <h1 className='rounded-bubble'>{it.L('{JAPAN ONLY}What?')}</h1>
                <h1 className='bg-blue'>{it.L('{JAPAN ONLY}What trading options do we have?')}</h1>
            </div>
            <div className='container'>
                <div className='gr-row'>
                    <h2 className='subtitle color-blue text-semibold gr-12'>{it.L('{JAPAN ONLY}Binary option offer the chance to predit whether the future price of a FX will be above or below a target rate, or between, or outside a target range:')}</h2>
                </div>
                <div className='gr-row gr-row-align-center cards cards--numbered'>
                    <div className='gr-6 gr-5-p gr-5-t gr-11-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/higher-lower-1.svg')} />
                                    </div>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/higher-lower-2.svg')} />
                                    </div>
                                </div>
                                <div className='icon-pair'>
                                    <span className='icon-sm icon-1' />
                                    <span className='icon-sm icon-2' />
                                </div>
                                <h3 className='color-orange text-medium'>{it.L('{JAPAN ONLY}Ladder Options')}</h3>
                                <p className='text-desc'>{it.L('{JAPAN ONLY}At the time of the judgement time predice the judgement rate above the barrier price or below the barrier price')}</p>
                            </div>
                            <div className='card-footer'>
                                <p>{it.L('{JAPAN ONLY}We offer a minimum trading period of 2 hours up to 1 year')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-6 gr-5-p gr-5-t gr-11-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/touch-notouch-1.svg')} />
                                    </div>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/touch-notouch-2.svg')} />
                                    </div>
                                </div>
                                <div className='icon-pair'>
                                    <span className='icon-sm icon-3' />
                                    <span className='icon-sm icon-4' />
                                </div>
                                <h3 className='color-orange text-medium'>{it.L('{JAPAN ONLY}Touch Options')}</h3>
                                <p className='text-desc'>{it.L('{JAPAN ONLY}We predict whether market price will touch barrier price by the end of trading period')}</p>
                            </div>
                            <div className='card-footer'>
                                <p>{it.L('{JAPAN ONLY}We will offer a minimum trading period of one week up to one year')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-6 gr-5-p gr-5-t gr-11-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/in-out-1.svg')} />
                                    </div>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/in-out-2.svg')} />
                                    </div>
                                </div>
                                <div className='icon-pair'>
                                    <span className='icon-sm icon-5' />
                                    <span className='icon-sm icon-6' />
                                </div>
                                <h3 className='color-orange text-medium'>{it.L('{JAPAN ONLY}Range Options: End-In / End-Out')}</h3>
                                <p className='text-desc'>{it.L('{JAPAN ONLY}At the judgement time, predit the judgement rate to be less thatn the upper limit barrier and above the lower limit barrier, or above the upper limit barrier or below the lower limit barrier')}</p>
                            </div>
                            <div className='card-footer'>
                                <p>{it.L('{JAPAN ONLY}We will offer a minimum trading period of one week up to one year')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-6 gr-5-p gr-5-t gr-11-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/in-out-3.svg')} />
                                    </div>
                                    <div className='gr-6 gr-padding-5-m'>
                                        <img className='responsive' src={it.url_for('images/japan/version1/in-out-4.svg')} />
                                    </div>
                                </div>
                                <div className='icon-pair'>
                                    <span className='icon-sm icon-7' />
                                    <span className='icon-sm icon-8' />
                                </div>
                                <h3 className='color-orange text-medium'>{it.L('{JAPAN ONLY}Range Option: Stay-In / Break-Out')}</h3>
                                <p className='text-desc'>{it.L('{JAPAN ONLY}It predicts whether the market price during the trading period is less than the upper limit barrier and maintains the lower limit barrier excess, or becomes equal to or higher than the upper limit barrier or belowe the lower limit barrier')}</p>
                            </div>
                            <div className='card-footer'>
                                <p>{it.L('{JAPAN ONLY}We will offer a minimum trading period of one week up to one year')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-polkadots pattern-stretch'>
            <div className='section-title gr-12-m'>
                <h1 className='rounded-bubble'>{it.L('{JAPAN ONLY}How?')}</h1>
                <h1 className='bg-blue'>{it.L('{JAPAN ONLY}Trade with 3 simple steps')}</h1>
            </div>
            <div className='container'>
                <div className='gr-row cards'>
                    <div className='gr-4 gr-12-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <h3 className='bg-bubble'>{it.L('{JAPAN ONLY}Set exchange rate')}</h3>
                                <img className='equal-height' src={it.url_for('images/japan/version1/coin.svg')} />
                            </div>
                        </div>
                    </div>
                    <div className='gr-4 gr-12-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <h3 className='bg-bubble'>{it.L('{JAPAN ONLY}Set amount (lot number)')}</h3>
                                <img className='equal-height' src={it.url_for('images/japan/version1/slider.svg')} />
                            </div>
                        </div>
                    </div>
                    <div className='gr-4 gr-12-m'>
                        <div className='card'>
                            <div className='card-body'>
                                <h3 className='bg-bubble'>{it.L('{JAPAN ONLY}Higher/lower rate')}</h3>
                                <img className='equal-height' src={it.url_for('images/japan/version1/high-low.svg')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern-geometric pattern-stretch'>
            <div className='section-title gr-12-m'>
                <div className='bg bg-ribbon'>
                    <h1 className='center-text'>{it.L('{JAPAN ONLY}Fast execution with one click')}</h1>
                </div>
            </div>
            <div className='container'>
                <div className='gr-row gr-row-align-center gr-row-align-bottom'>
                    <div className='gr-4 gr-6-p gr-10-m center-text'>
                        <div className='bg bg-bubble-box'>
                            <h1>{it.L('{JAPAN ONLY}High speed execution')}</h1>
                        </div>
                        <img className='responsive' src={it.url_for('images/japan/version1/bg-light-blue.svg')} />
                    </div>
                    <div className='gr-4 gr-6-p gr-12-m'>
                        <div>
                            <h2 className='color-orange text-medium'>{it.L('{JAPAN ONLY}You can purchase a trade with one click')}</h2>
                            <p className='color-blue'>{it.L('{JAPAN ONLY}Just switch this button to prevent misoperation')}</p>
                            <img className='' src={it.url_for('images/japan/version1/lock-switch.svg')} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-confetti pattern-stretch fill-bg-color'>
            <div className='container'>
                <div className='gr-row'>
                    <div className='section-title gr-12'>
                        <h1 className='bg-orange text-semibold center-text'>{it.L('{JAPAN ONLY}Why choose binary options over foreign exchange')}</h1>
                    </div>
                    <h2 className='subtitle center-text color-blue text-semibold gr-12'>{it.L('{JAPAN ONLY}A binary option can provide profit opportunities even in a small price range, where FX normally doesn’t. Here is a table comparison of foreign exchange and binary options:')}</h2>
                </div>
                <div className='gr-row gr-row-align-center cards'>
                    <div className='gr-5 gr-6-p gr-12-m'>
                        <div className='card--light'>
                            <div className='card-header__bubble'>
                                <h3>{it.L('{JAPAN ONLY}Foreign exchange one cancellation order - profit take & stop-loss order')}</h3>
                            </div>
                            <div className='card-body'>
                                <div className='gr-row flex-space-between'>
                                    <div className='box-o'>
                                        <img className='icon-sm big' src={it.url_for('images/japan/version1/jpy.svg')} />
                                        <span className='size-3'>{it.L('{JAPAN ONLY}¥110.50 / lot')}</span>
                                    </div>
                                    <div className='box'>
                                        <img className='icon-sm' src={it.url_for('images/japan/version1/clock.svg')} />
                                        <span className='size-3'>{it.L('{JAPAN ONLY}1 hour')}</span>
                                    </div>
                                </div>
                                <div className='flex margin-top-20'>
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
                                    <p className='color-light-blue'>{it.L('{JAPAN ONLY}Margin: ¥ 442,000')}
                                        <br />
                                        {it.L('{JAPAN ONLY}Maximum loss: not guaranteed')}
                                    </p>
                                </div>
                            </div>
                            <div className='card-footer pull-text'>
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}$ 100,000 x 110.50 (USD / JPY) x 4% (margin calculation) = ¥ 442,000')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-5 gr-6-p gr-12-m'>
                        <div className='card--light'>
                            <div className='card-header__bubble'>
                                <h3>{it.L('{JAPAN ONLY}Binary option can make a higher profit, for the same risk but less margin')}</h3>
                            </div>
                            <div className='card-body'>
                                <div className='gr-row flex-space-between'>
                                    <div className='box-o'>
                                        <img className='icon-sm big' src={it.url_for('images/japan/version1/jpy.svg')} />
                                        <span className='size-3'>{it.L('{JAPAN ONLY}¥200 /  lot')}</span>
                                    </div>
                                    <div className='box'>
                                        <img className='icon-sm' src={it.url_for('images/japan/version1/clock.svg')} />
                                        <span className='size-3'>{it.L('{JAPAN ONLY}1 hour')}</span>
                                    </div>
                                </div>
                                <div className='flex margin-top-20'>
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
                                    <p className='color-red'>{it.L('{JAPAN ONLY}Margin: ¥ 10,000')}
                                        <br />
                                        {it.L('{JAPAN ONLY}Maximum loss: guaranteed')}
                                    </p>
                                </div>
                            </div>
                            <div className='card-footer'>
                                <p className='size-desc color-gray'>{it.L('{JAPAN ONLY}50 x ￥1,000 - 50 x ￥200 = ￥50,000 - ￥10,000 = ￥40,000')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-semicircle'>
            <div className='section-title gr-12-m'>
                <h1 className='bg-bubble margin-bottom'>{it.L('{JAPAN ONLY}Key plus point')}</h1>
            </div>
            <div  className='container'>
                <div className='gr-row gr-row-align-center cards'>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}trade with 50 yen to 999 yen')}</p>
                        </div>
                    </div>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}set daily loss limit')}</p>
                        </div>
                    </div>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}no transaction fees')}</p>
                        </div>
                    </div>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}trade 9 currencies')}</p>
                        </div>
                    </div>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}4 options types')}</p>
                        </div>
                    </div>
                    <div className='gr-2 gr-3-p gr-6-m'>
                        <div className='card--light key-plus icon-heart'>
                            <p>{it.L('{JAPAN ONLY}trading periods from 2 hours to 1 year')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern-geometric'>
            <div className='bg bg-shine-v'>
                <div className='container center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <form id='email_middle' className='signup-form' noValidate>
                                <h1 className='text-medium'>{it.L('{JAPAN ONLY}Sign up for a free account')}</h1>
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
                    <h2 className='content-inverse-color text-semibold'>{it.L('{JAPAN ONLY}Why Binary.com?')}</h2>
                </div>
            </div>
            <div className='container spacing'>
                <h1 className='center-text text-semibold color-orange margin-bottom-40'>{it.L('{JAPAN ONLY}Easy to use design. Fast execution; multifunction charting system and smartphone optimized display.')}</h1>
                <div className='gr-row'>
                    <div className='gr-8 gr-push-1 gr-9-m gr-push-0-m'>
                        <img className='responsive' src={it.url_for('images/japan/version1/apple-macbook-pro-15@2x.jpg')} />
                    </div>
                    <div className='gr-2 gr-push-1 gr-3-m gr-push-0-m flex-end'>
                        <img className='responsive' src={it.url_for('images/japan/version1/apple-i-phone-7-silver@2x.jpg')} />
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-confetti fill-bg-color'>
            <div  className='container'>
                <div className='gr-row'>
                    <div className='section-title gr-12'>
                        <h2 className='bg-orange text-semibold v-padding color-white center-text'>{it.L('{JAPAN ONLY}YOUR FUNDS ARE HELD SECURELY')}</h2>
                    </div>
                    <h2 className='subtitle color-blue text-semibold gr-12'>{it.L('{JAPAN ONLY}All customer funds are deposited with JSF Trust & Banking, and in the event of our business failure, they will be refunde via an independent attorney acting as beneficiary agent')}</h2>

                </div>
                <div className='gr-row gr-row-align-center cards'>
                    <div className='gr-5 gr-6-p gr-12-m'>
                        <div className='card--light'>
                            <div className='card-header__bubble card-header__bubble-sm'>
                                <h3>{it.L('{JAPAN ONLY}Normal time')}</h3>
                            </div>
                            <div className='card-body'>
                                <img className='responsive' src={it.url_for('images/japan/version1/secure-1.svg')} />
                            </div>
                        </div>
                    </div>
                    <div className='gr-5 gr-6-p gr-12-m'>
                        <div className='card--light'>
                            <div className='card-header__bubble card-header__bubble-sm'>
                                <h3>{it.L('{JAPAN ONLY}When our company collapse')}</h3>
                            </div>
                            <div className='card-body'>
                                <img className='responsive' src={it.url_for('images/japan/version1/secure-2.svg')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-semicircle'>
            <div  className='container'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='card header-offset'>
                            <div className='card-header__ribbon'>
                                <h1>{it.L('{JAPAN ONLY}The learning center')}</h1>
                            </div>
                            <div className='card-body gr-row'>
                                <div className='gr-2 gr-push-1 gr-4-p gr-push-0-p gr-10-m gr-push-1-m'>
                                    <img className='img-md' src={it.url_for('images/japan/version1/customer-support.svg')} />
                                    <p>{it.L('{JAPAN ONLY}We have a support team to answer your questions: <a href=\'mailto:support@binary.com\'>support@binary.com</a>')}</p>
                                </div>
                                <div className='gr-2 gr-push-3 gr-4-p gr-push-0-p gr-10-m gr-push-1-m'>
                                    <img className='img-md' src={it.url_for('images/japan/version1/accounting-book.svg')} />
                                    <p>{it.L('{JAPAN ONLY}We will give you a virtual account that already has ¥ 1,000,000.')}</p>
                                </div>
                                <div className='gr-2 gr-push-5 gr-4-p gr-push-0-p gr-10-m gr-push-1-m'>
                                    <img className='img-md' src={it.url_for('images/japan/version1/school.svg')} />
                                    <p>{it.L('{JAPAN ONLY}Learn more about binary options for academies using webinars, ebooks, videos.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-polkadots fill-bg-color'>
            <div className='section-title gr-12-m'>
                <h1 className='rounded-bubble'>{it.L('{JAPAN ONLY}How?')}</h1>
                <h1 className='bg-blue'>{it.L('{JAPAN ONLY}How to open an account')}</h1>
            </div>
            <div className='container'>
                <div className='gr-row bubble-outline-wrapper'>
                    <div className='gr-2 gr-push-2 gr-3-p gr-push-0-p gr-6-m gr-push-0-m gr-padding-20'>
                        <div className='bubble-outline'>
                            <span className='numbered' />
                            <p>{it.L('{JAPAN ONLY}Apply for an account & provide ID')}</p>
                        </div>
                        <img className='icon-lg' src={it.url_for('images/japan/version1/new-acc.svg')} />
                    </div>
                    <div className='gr-2 gr-push-2 gr-3-p gr-push-0-p gr-6-m gr-push-0-m gr-padding-20'>
                        <div className='bubble-outline'>
                            <span className='numbered' />
                            <p>{it.L('{JAPAN ONLY}Take the knowledge confirmation test')}</p>
                        </div>
                        <img className='icon-lg' src={it.url_for('images/japan/version1/knowledge-test.svg')} />
                    </div>
                    <div className='gr-2 gr-push-2 gr-3-p gr-push-0-p gr-6-m gr-push-0-m gr-padding-20'>
                        <div className='bubble-outline'>
                            <span className='numbered' />
                            <p>{it.L('{JAPAN ONLY}Enable account with secure e-mail')}</p>
                        </div>
                        <img className='icon-lg' src={it.url_for('images/japan/version1/secure-email.svg')} />
                    </div>
                    <div className='gr-2 gr-push-2 gr-3-p gr-push-0-p gr-6-m gr-push-0-m gr-padding-20'>
                        <div className='bubble-outline'>
                            <span className='numbered' />
                            <p>{it.L('{JAPAN ONLY}Start trading after depositing money')}</p>
                        </div>
                        <img className='icon-lg' src={it.url_for('images/japan/version1/deposit-money.svg')} />
                    </div>
                </div>
            </div>
        </section>

        <section className='pattern pattern-wave'>
            <div className='container'>
                <div className='card--light no-padding'>
                    <div className='card-body'>
                        <div className='gr-row gr-row-align-center gr-row-align-middle'>
                            <div className='gr-4 gr-12-p gr-12-t gr-12-m center-text'>
                                <h3>{it.L('{JAPAN ONLY}Award-winning trading excellence')}</h3>
                            </div>
                            <div className='gr-8 gr-12-p gr-12-t gr-12-m'>
                                <img className='responsive responsive-lg' src={it.url_for('images/japan/version1/opwa.svg')} />
                                <img className='responsive responsive-lg' src={it.url_for('images/japan/version1/mena-fx-pro@2x.jpg')} />
                                <img className='responsive responsive-lg' src={it.url_for('images/japan/version1/egr-operator@2x.png')} />
                                <img className='responsive responsive-lg' src={it.url_for('images/japan/version1/t-2-w@2x.png')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className='bg bg-shine-rectangle'>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <form id='email_bottom' className='signup-form' noValidate>
                            <h1 className='text-semibold margin-bottom-30'>{it.L('{JAPAN ONLY}Sign up for a free account')}</h1>
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

        <footer className='content-inverse-color'>
            <div className='primary-bg-color-dark'>
                <p>{it.L('{JAPAN ONLY}Disclaimer text here')}</p>
            </div>
            <div className='primary-bg-color flex flex-space-between'>
                <p>{it.L('{JAPAN ONLY}Footer text here')}</p>
                <img className='logo' src={it.url_for('images/japan/version1/logo-dark.svg')} />
            </div>
        </footer>

        <div id='affiliate_disclaimer_popup' />
    </Layout>
);

export default BinaryJapan;
