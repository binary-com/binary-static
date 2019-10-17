/* eslint-disable react/jsx-no-target-blank */
import React  from 'react';
import Layout from './_common/layout.jsx';

const gridLP = () => (
    <Layout
        meta_description={'An exciting mobile trading experience'}
        css_files={[
            it.url_for('css/grid_lp_style.css'),
            'https://style.binary.com/binary.css',
        ]}
        js_files={[
            'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
            'https://style.binary.com/binary.more.js',
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/binary_grid.js'),
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
                            <div className='gr-6 gr-12-t gr-12-m gr-12-p'>
                                <h1 className='header-title content-inverse-color ft-300'>{('An exciting mobile trading experience')}</h1>
                                <span className='header-sub secondary-color'>{('Action-packed trading with low stakes and short durations.')}</span>
                                <p>
                                    <a className='android-button invisible button download'><span className='button-lg'>{('Download for Android')}</span></a>
                                    <span className='ios-message invisible content-inverse-color'>{('Binary Grid is currently only available on Android devices.')}</span>
                                </p>
                            </div>
                            <div className='gr-6 gr-12-t gr-12-m gr-12-p'><img className='phone' src={it.url_for('images/grid_lp/phone.png')} alt='seamless trading on your smartphone' /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12 section-header'>
                            <h2 className='primary-color'>{('The all-new Binary Grid')}</h2>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-touch' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Three different trade types available')}</h3>
                                <p>{('Tap and swipe to purchase Rise/Fall, Ends Outside, and Ends Between contracts.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-contracts' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Multiple contracts at a time')}</h3>
                                <p>{('Open several positions simultaneously.')}</p>
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
                                <p>{('Get started with stakes as low as $1.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row gr-row-align-middle'>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-risk-free-env' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Start with a practice account')}</h3>
                                <p>{('Refine your trading skills before switching to a real money account.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-12-p'>
                            <div className='left-col-feature'>
                                <div className='icon-block icon-currencies' />
                            </div>
                            <div className='right-col-feature'>
                                <h3>{('Trade in USD')}</h3>
                                <p>{('Other currencies coming soon.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section fill-bg-color lg-center'>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12 section-header'>
                            <h2 className='primary-color'>{('Ready to get started? Get Binary Grid for Android')}</h2>
                            <p className='section-subtitle primary-color'>{('Take our trading platform with you wherever you go.')}</p>
                        </div>
                    </div>
                    <div className='gr-row center-text gr-row-align-between'>
                        <div className='gr-1on5 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='line-right' />
                            <div className='step icon-step-1' />
                            <p><a className='android-button download invisible'>{('Download Binary Grid')}</a><span className='ios-message invisible'>{('Download Binary Grid')}</span> {('for Android.')}</p>
                        </div>
                        <div className='gr-1on5 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='line-left' />
                            <div className='line-right' />
                            <div className='step icon-step-2' />
                            <p>{('Open the downloaded file.')}</p>
                        </div>
                        <div className='gr-1on5 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='line-left' />
                            <div className='line-right' />
                            <div className='step icon-step-3' />
                            <p>{('Update your device’s security settings to allow installations from this source.')}</p>
                        </div>
                        <div className='gr-1on5 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='line-left' />
                            <div className='line-right' />
                            <div className='step icon-step-4' />
                            <p>{('Approve the installation.')}</p>
                        </div>
                        <div className='gr-1on5 gr-12-t gr-12-m gr-12-p col-step'>
                            <div className='line-left' />
                            <div className='step icon-step-grid-icon' />
                            <p>{('Once the app is installed successfully, tap on the app icon to open.')}</p>
                        </div>
                    </div>
                    <div className='divider' />
                    <div className='gr-row gr-row-align-around'>
                        <div className='gr-6 gr-12-t gr-12-m gr-12-p'>
                            <div className='padding-md ft-bold'>
                                <p>{('Only available for Android devices at the moment. Binary Grid for iOS devices coming soon.')}</p>
                            </div>
                        </div>
                        <div className='gr-4 gr-12-t gr-12-m gr-12-p'>
                            <div className='white-bg-color padding-md'>
                                <p className='secondary-color no-margins ft-bold ft-22'>{('Minimum requirements:')}</p>
                                <ul className='bullet'>
                                    <li>{('Android 6.0')}</li>
                                    <li>{('A USD Binary.com account')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-12 center-text'>
                            <a className='android-button invisible button download'><span className='button-lg'>{('Download for Android')}</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section-xs primary-bg-color'>
                <div className='container center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h4 className='content-inverse-color'>{('Need further assistance?')} <span className='block-xs'>{('Connect with us')}</span></h4>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4'>
                            <a href={it.url_for('contact')} target='_blank'>
                                <div className='lp-icon icon-academy' />
                                <p className='content-inverse-color font-s'>{('Help Centre')}</p>
                            </a>
                        </div>
                        <div className='gr-4'>
                            <a href='https://www.facebook.com/binarydotcom' target='_blank' rel='noopener noreferrer'>
                                <div className='lp-icon icon-fb' />
                                <p className='content-inverse-color font-s'>{('Facebook')}</p>
                            </a>
                        </div>
                        <div className='gr-4'>
                            <a href='https://t.me/binarydotcom' target='_blank' rel='noopener noreferrer'>
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
/* eslint-enable react/jsx-no-target-blank */
