import React from 'react';
import Layout from './_common/layout.jsx';

const UsbPage = () => (
    <Layout
        meta_description={`${it.broker_name} Introducing USB`}
        css_files={[
            it.url_for('css/usb_style.css'),
            'https://style.binary.com/binary.css',
            'https://style.binary.com/binary.more.css',
        ]}
        js_files={[
            'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
            'https://style.binary.com/binary.more.js',
            'https://academy.binary.com/js/animate.min.js',
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/usb_page.js'),
        ]}
    >

        <div id='page-top' />
        <nav className='navbar navbar-custom navbar-fixed-top' role='navigation'>
            <div className='navbar-container'>
                <div className='nav-col-left'>
                    <div className='logo-wrapper'>
                        <a className='logo-parent logo-scroll' href='#page-top'>
                            <div className='logo'>
                                <div />
                            </div>
                            <div className='mobile-hide binary-logo-text'>
                                <div />
                            </div>
                        </a>
                    </div>
                </div>
                <div className='nav-col-right'>
                    <div id='push' className='grill grill-ico' />
                    <div id='push-nav' className='topnav'>
                        <a className='page-scroll' href='#video'>{it.L('Overview')}</a>
                        <a className='page-scroll' href='#why-usb'>{it.L('Why USB')}</a>
                        <a className='page-scroll' href='#get-started'>{it.L('Get started')}</a>
                        <a className='page-scroll' href='#benefits'>{it.L('Benefits')}</a>
                        <a className='page-scroll' href='#tech'>{it.L('Technology')}</a>
                        <a className='page-scroll' href='#faq'>{it.L('FAQ')}</a>
                    </div>
                </div>
            </div>
        </nav>
        <div className='home--header'>
            <div className='header-content'>
                <h1 className='header-title content-inverse-color ft-300'>{it.L('Welcome to the future')}</h1>
                <span className='header-sub secondary-color'>{it.L('Introducing USB')}</span>
                <span className='header-sub content-inverse-color'>{it.L('A stablecoin backed by the US Dollar')}</span>
            </div>
        </div>
        <div className='section-md primary-bg-color coin-section'>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-middle'>
                    <div className='gr-2 gr-12-m gr-12-p'>
                        <img className='usb-coin' src={it.url_for('images/usb_page/usb-coin-logo.png')} alt='USB' />
                    </div>
                    <div className='gr-10 gr-12-m gr-12-p'>
                        <p className='content-inverse-color ft-400'>{it.L('Guaranteed by [_1], USB is a digital currency pegged to the US Dollar on a one-to-one basis. Send and receive payments with the peace of mind that your currency is backed by the strength of [_1] balance sheet.', it.broker_name)}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='video' className='dark-grey-bg section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='section-title primary-color'>{it.L('An overview of the [_1] USB stablecoin', it.broker_name)}</h2>
                        <p>{it.L('Put your confidence in an optimal currency backed by a market leader.')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-center'>
                    <div className='gr-9'>
                        <div className='separator-md' />
                        <div className='video-container'>
                            <iframe src='https://www.youtube.com/embed/pl2jq7EBvdU?rel=0&showinfo=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
                        </div>
                        <div className='separator-md' />
                    </div>
                </div>
                <div className='gr-row gr-row-align-center'>
                    <div className='gr-12'>
                        <p>{it.L('Explore the possibilities of a new generation of cryptocurrency')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='why-usb' className='section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-50'>
                        <h2 className='section-title'>{it.L('Why USB?')}</h2>
                        <p>{it.L('The value of USB is pegged to the US Dollar, so you get the best of both worlds: the benefits of decentralised digital assets and the stability of fiat currencies.')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-redeem' />
                        <h3 className='ft-400'>{it.L('Fully backed by US Dollar')}</h3>
                        <p>{it.L('USB is a stable coin pegged to the US Dollar on a one-to-one basis. [_1] guarantees that 1 USB will always be worth 1 USD.', it.broker_name)}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-redeem-usd' />
                        <h3 className='ft-400'>{it.L('Redeem for USD anytime')}</h3>
                        <p>{it.L('To redeem USB for USD, complete the [_1] KYC check, then perform the conversion using our ', it.broker_name)}<a href={it.url_for('cashier/account_transfer')}>{it.L('transfer between accounts')}</a> {it.L('facility.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-peaceofmind' />
                        <h3 className='ft-400'>{it.L('Peace of mind')}</h3>
                        <p>{it.L('USB is backed by [_1] –– a profitable, 18-year-old company with', it.broker_name)} <a href={it.url_for('binary-in-numbers')}>{it.L('annual turnover exceeding USD 1 billion')}</a>.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='gr-row'>
                <div className='gr-12'>
                    <div className='separator-line-thin-gray' />
                </div>
            </div>
        </div>
        <div id='usb-clients' className='section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title'>{it.L('Who is it for?')}</h2>
                        <p>{it.L('USB can be used by anyone for any transaction that requires a stable currency, including:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-clients' />
                        <h3 className='ft-400'>{it.L('[_1] clients', it.broker_name)}</h3>
                        <p>{it.L('Trade on [_1] using USB and enjoy exclusive benefits such as discounts on binary option contract prices.', it.broker_name)}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-crypto-traders' />
                        <h3 className='ft-400'>{it.L('Crypto traders')}</h3>
                        <p>{it.L('Use USB to hedge against volatility in the cryptocurrency markets. Move in and out of cryptocurrencies and USB to profit from market swings.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-online-business' />
                        <h3 className='ft-400'>{it.L('Online businesses')}</h3>
                        <p>{it.L('Accept USB in your online store for secure and efficient payments, and avoid the hassle of dealing with banks and credit card companies.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='get-started' className='primary-bg-color section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title content-inverse-color'>{it.L('How do I start?')}</h2>
                        <p className='content-inverse-color'>{it.L('Start buying USB and store the tokens in a compatible wallet for future transactions:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-buy' />
                        <h3 className='ft-400 content-inverse-color'>{it.L('Buy')}</h3>
                        <p className='content-inverse-color'>{it.L('Purchase USB via your [_1] account. 1 USB is always priced at 1 USD.', it.broker_name)}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-hold' />
                        <h3 className='ft-400 content-inverse-color'>{('Hold')}</h3>
                        <p className='content-inverse-color'>{it.L('Hold your USB in any ERC20-compatible wallet, such as')} <a className='content-inverse-color' href='https://trustwalletapp.com/' target='_blank' rel='noopener noreferrer'>{it.L('Trust Wallet')}</a>.</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-trade' />
                        <h3 className='ft-400 content-inverse-color'>{it.L('Trade')}</h3>
                        <p className='content-inverse-color'>{it.L('We’re applying for listing of the USB token on major cryptocurrency exchanges.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='benefits' className='section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-30'>
                        <h2 className='section-title'>{it.L('Exclusive benefits on [_1]', it.broker_name)}</h2>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-30'>
                        <h2 className='primary-color'>{it.L('Enjoy discounts for trading in USB')}</h2>
                        <p>{it.L('[_1] clients who trade using USB will enjoy discounts on binary option purchase prices. The amount of the discount depends on the probability of the option (i.e. its stake divided by payout). The discount amounts are:', it.broker_name)}</p>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='gr-row center-text'>
                    <div className='gr-6 secondary-bg-color content-inverse-color right-white-border'>
                        <p>{it.L('Contract probability')}</p>
                    </div>
                    <div className='gr-6 secondary-bg-color content-inverse-color'>
                        <p>{it.L('Discount for trading in USB')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 fill-bg-color right-white-border'>
                        <p>{('0-19.999%')}</p>
                    </div>
                    <div className='gr-6 fill-bg-color'>
                        <p>{('0.25%')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 dark-grey-bg right-white-border'>
                        <p>{('20-39.999%')}</p>
                    </div>
                    <div className='gr-6 dark-grey-bg'>
                        <p>{('0.20%')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 fill-bg-color right-white-border'>
                        <p>{('40-59.999%')}</p>
                    </div>
                    <div className='gr-6 fill-bg-color'>
                        <p>{('0.15%')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 dark-grey-bg right-white-border'>
                        <p>{('60-79.999%')}</p>
                    </div>
                    <div className='gr-6 dark-grey-bg'>
                        <p>{('0.10%')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 fill-bg-color right-white-border'>
                        <p>{('80-94.999%')}</p>
                    </div>
                    <div className='gr-6 fill-bg-color'>
                        <p>{('0.05%')}</p>
                    </div>
                </div>
                <div className='gr-row center-text'>
                    <div className='gr-6 dark-grey-bg right-white-border'>
                        <p>{('95%')}</p>
                    </div>
                    <div className='gr-6 dark-grey-bg'>
                        <p>{('0%')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='separator-lg' />
        <div id='tech' className='section-md dark-grey-bg'>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-50'>
                        <h2 className='section-title primary-color'>{it.L('Technical implementation')}</h2>
                        <p>{it.L('Our USB token is powered by secure and transparent blockchain technology:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-contract' />
                        <h3 className='ft-400'>{it.L('Contract address')}</h3>
                        <p>{it.L('USB is an ERC20 token.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-supply' />
                        <h3 className='ft-400'>{it.L('Supply and divisibility')}</h3>
                        <p>{it.L('Each token is divisible to 18 decimal places.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-source-code' />
                        <h3 className='ft-400'>{it.L('Source code')}</h3>
                        <p>{it.L('The source code of the USB token can be freely')} <a href='http://etherscan.io/address/0xaf8bef28181aa864b3b60cc88d1f3788c1025ecb' target='_blank' rel='noopener noreferrer'>{it.L('audited on Etherscan')}</a>.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='section-md' id='faq'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title'>{it.L('[_1] USB – Frequently asked questions', it.broker_name)}</h2>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='separator-xl' />
                        <div id='accordion'>
                            <h3>{it.L('What is USB?')}</h3>
                            <div>{it.L('USB is a stablecoin exclusively issued by [_1]. It is permanently pegged to the US dollar on a one-to-one basis.', it.broker_name)}</div>
                            <h3>{it.L('What are the usages of USB?')}</h3>
                            <div>{it.L('Use USB as normal money. For example, you can initiate trades, payments, and online transactions with USB. Purchase your [_1] contracts with USB to enjoy exclusive discounts on contract prices.', it.broker_name)}</div>
                            <h3>{it.L('Why use USB?')}</h3>
                            <div>{it.L('USB has a flat rate: one USB is always equal to one US dollar. Thus, it is as stable and secure as the US dollar. It is also issued and guaranteed by [_1], a market leader with 18 years of trading history and a billion-dollar annual turnover. Moreover, by using USB for trading on [_1], you’ll be entitled to special discounts on contract prices.', it.broker_name)}</div>
                            <h3>{it.L('Who can use USB?')}</h3>
                            <div>{it.L('Anybody who wants to make a transaction with a stable, dependable cryptocurrency can use USB. [_1] clients can use USB to get discounts on contract prices when they trade on [_1]. Crypto traders can use USB to hedge against price volatility in cryptocurrency markets and exchange USB with other cryptocurrencies to benefit from market swings. Online consumers and businesses can use USB to enjoy a more secure and efficient payment method and avoid the hassle of dealing with banks and credit card companies.', it.broker_name)}</div>
                            <h3>{it.L('How many USBs are supplied?')}</h3>
                            <div>{it.L('Twenty million.')}</div>
                            <h3>{it.L('How can I get started with USB?')}</h3>
                            <div>
                                <ol>
                                    <li>{it.L('Create an ERC-20 compatible wallet to carry your USB')}</li>
                                    <li>{it.L('Purchase USB on [_1]', it.broker_name)}</li>
                                    <li>{it.L('Use your USB to trade binary options, Forex, CFDs, and more at [_1]', it.broker_name)}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='separator-md' />
        </div>

    </Layout>
);

export default UsbPage;
