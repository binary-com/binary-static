import React from 'react';
import Layout from './_common/layout.jsx';

const gridLP = () => (
    <Layout
        meta_description={`${it.broker_name} Our exciting new mobile trading app, seamless trading on your smartphone.`}
        css_files={[
            it.url_for('css/grid_lp_style.css'),
            'https://style.binary.com/binary.css',
        ]}
        js_files={[
            'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
            'https://style.binary.com/binary.more.js',
            it.url_for('js/landing_pages/common.js'),
        ]}
    >

        <div className='binary-grid-landing'>
            <div className='home--header'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <div className='logo' />
                        </div>
                    </div>
                    <div className='home-header-content lg-center'>
                        <div className='gr-row gr-row-align-middle'>
                            <div className='gr-5 gr-12-t gr-12-m gr-12-p'>
                                <h1 className='header-title content-inverse-color ft-300'>{('Our exciting new mobile trading app')}</h1>
                                <span className='header-sub secondary-color'>{('Seamless trading on your smartphone')}</span>
                                <p><a className='button' href=''><span className='button-lg'>{('Get BinaryGrid now')}</span></a></p>
                            </div>
                            <div className='gr-7 gr-12-t gr-12-m gr-12-p'><img className='phone' src={it.url_for('images/grid_lp/phone@3x-cmp.png')} alt='seamless trading on your smartphone' /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2 className='primary-color'>{('Built for your convenience, designed by traders')}</h2>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-stats' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Micro-trading on the go')}</h3>
                                <p>{('Fast-paced, action packed trading experience at your fingertips.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-risk-free-env' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Start with a practice account')}</h3>
                                <p>{('Refine your trading skills before switching to a real money account.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-date-time' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Continuous trading')}</h3>
                                <p>{('Trade at your convenience, 24/7.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-wallet' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Limited risks')}</h3>
                                <p>{('Get started with stakes as low as 10¢.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-contracts' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Multiple contracts at a time')}</h3>
                                <p>{('Open several single-cell and multi-cell contracts simultaneously.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-touch' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Speed of touch')}</h3>
                                <p>{('Trade in the moment with your touch screen device.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-currencies' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Trade in USD')}</h3>
                                <p>{('Other currencies coming soon.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p' />
                    </div>
                </div>
            </div>
            <div className='section fill-bg-color lg-center'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2 className='primary-color'>{('Ready to get started? Get Binary Grid for Android')}</h2>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-3 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='step icon-step-1' />
                            <p>{('Go here to download Binary Grid for Android.')}</p>
                        </div>
                        <div className='gr-3 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='step icon-step-2' />
                            <p>{('Go here to download Binary Grid for Android.')}</p>
                        </div>
                        <div className='gr-3 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='step icon-step-3' />
                            <p>{('to download Binary Grid for Android.')}</p>
                        </div>
                        <div className='gr-3 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='step icon-step-4' />
                            <p>{('to download Binary Grid for Android.')}</p>
                        </div>
                    </div>
                    <div className='divider' />
                    <div className='gr-row gr-row-align-around'>
                        <div className='gr-4 gr-12-t gr-12-m gr-12-p'>
                            <div className='white-bg-color padding-md'>
                                <p>{('Only available for Android devices at the moment.')}</p>
                                <p>{('Binary Grid for iOS devices coming soon.')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-12-t gr-12-m gr-12-p'>
                            <div className='white-bg-color padding-md'>
                                <h3 className='secondary-color'>{('Minimum requirements:')}</h3>
                                <p>{('Android 6.0')}</p>
                                <p>{('A USD Binary.com account')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-12 center-text'>
                            <a className='button' href=''><span className='button-lg'>{('Get BinaryGrid now')}</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section-xs primary-bg-color'>
                <div className='container center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h4 className='content-inverse-color'>{('Need further assistance? Connect with us')}</h4>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4'>
                            <a href='https://www.binary.me/en/contact.html'>
                                <div className='lp-icon icon-academy' />
                                <p className='content-inverse-color font-s'>{('Help Centre')}</p>
                            </a>
                        </div>
                        <div className='gr-4'>
                            <a href='https://www.facebook.com/binarydotcom'>
                                <div className='lp-icon icon-fb' />
                                <p className='content-inverse-color font-s'>{('Facebook')}</p>
                            </a>
                        </div>
                        <div className='gr-4'>
                            <a href='https://t.me/binarydotcom'>
                                <div className='lp-icon icon-telegram' />
                                <p className='content-inverse-color font-s'>{('Telegram')}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </Layout>
);

export default gridLP;
