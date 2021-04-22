import React from 'react';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs,
} from '../_common/components/tabs.jsx';
import { SeparatorLine } from '../_common/components/separator_line.jsx';

const BoxInner = ({ className = '', href, target, image, text }) => (
    <div className={`gr-4 center-text ${className}`}>
        { href ?
            <React.Fragment>
                <a href={target ? href : it.url_for(href)} target={target || '_self'}>
                    <img className='gr-12 gr-centered' src={it.url_for(`images/pages/mt5_signals/${image}.svg`)} height='64px' />
                </a>
                <p>{text}</p>
            </React.Fragment>
            :
            <React.Fragment>
                <img className='gr-12 gr-centered' src={it.url_for(`images/pages/mt5_signals/${image}.svg`)} height='64px' />
                <p>{text}</p>
            </React.Fragment>
        }
    </div>
);

const Box = ({ children }) => (
    <div className='gr-12'>
        <div className='gr-row full-height'>
            {children}
        </div>
    </div>
);

const Mt5Signals = () => (
    <div className='static_full'>
        <div className='container'>
            <h1 className='center-text'>{it.L('MetaTrader 5 Signals')}</h1>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='mt5_signals_tabs'
                    className='gr-parent tab-selector-wrapper'
                    items={[
                        { id: 'signal_subscriber', text: it.L('Signal Subscriber') },
                        { id: 'signal_provider', text: it.L('Signal Provider') },
                        { id: 'mt5_signals_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='signal_subscriber'>
                            <div className='container gr-padding-20 gr-parent'>
                                <p>{it.L('The MT5 trading signals service allows you to copy the trades of more experienced traders to your MT5 account. Once you’ve subscribed to a signal, the provider’s deals will be automatically replicated on your [_1] MT5 trading account each time they place a trade.', it.website_name)}
                                </p>
                            </div>
                            <div className='fill-bg-color gr-padding-30 fullwidth' >
                                <div className='container gr-padding-30 gr-child'>
                                    <h2 className='center-text'>
                                        {it.L('Benefits of subscribing to MT5 signals')}
                                    </h2>
                                    <div className='fill-bg-color'>
                                        <div className='container section'>
                                            <div className='gr-padding-10 facts'>
                                                <div className='gr-row no-padding'>
                                                    <Box>
                                                        <BoxInner className='border-right-top' image='copy_trade' text={it.L('Minimise trading risk by copying from expert traders.')} />
                                                        <BoxInner className='border-right-top' image='save_time' text={it.L('Save time – no need to open, monitor, and close trades.')} />
                                                        <BoxInner className='border-right-top' image='easy_setup' text={it.L('Easy to set up – no installation required.')} />
                                                    </Box>
                                                    <Box>
                                                        <BoxInner className='border-right-bottom gr-padding-30' image='provider_performance' text={it.L('Full disclosure of each providers’ performances.')} />
                                                        <BoxInner className='border-right-bottom gr-padding-30' image='no_hidden_fees' text={it.L('No hidden fees or commissions.')} />
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='gr-padding-30' >
                                <div className='container gr-padding-30 gr-child'>
                                    <h2 className='center-text'>
                                        {it.L('How to subscribe to a MT5 signal')}
                                    </h2>
                                    <div className='gr-row gr-padding-30'>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_terminal.png')} />
                                            <ol>
                                                <li>{it.L('From your MT5 trading terminal, click on the [_1]Signals[_2] tab to view the list of signal providers.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_subscribe.png')} />
                                            <ol start='2'>
                                                <li>{it.L('Select the signal provider you prefer and click the [_1]Subscribe[_2] button.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_trading_risk.png')} />
                                            <ol start='3'>
                                                <li>{it.L('Configure your trading and risk management parameters. Then click [_1]OK[_2] to complete the process.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <p>{it.L('[_1]Note:[_2] For a wider selection of signal providers, go to [_3]MQL5 showcase page[_4] and search for Deriv under the Broker server field.', '<strong>', '</strong>', '<a href="https://www.mql5.com/en/signals/">', '</a>')}
                                    </p>
                                </div>
                            </div>

                            <SeparatorLine />

                            <div className='gr-padding-30' >
                                <div className='container gr-padding-30 gr-child'>
                                    <h2 className='center-text'>
                                        {it.L('How to renew or cancel your subscription')}
                                    </h2>
                                    <div className='gr-row gr-padding-30'>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_terminal.png')} />
                                            <ol>
                                                <li>{it.L('From your MT5 trading terminal, click on the [_1]Signals[_2] tab.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_statistics.png')} />
                                            <ol start='2'>
                                                <li>{it.L('Click on the [_1]My Statistics[_2] tab and select your signal provider.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='responsive' src={it.url_for('images/pages/mt5_signals/mt5_subscribe2.png')} />
                                            <ol start='3'>
                                                <li>{it.L('Click the [_1]Renew[_2] button to renew the service or the [_1]Unsubscribe[_2] button to cancel the subscription.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div>
                                        <p><strong>{it.L('Note:')}</strong></p>
                                        <ol>
                                            <li>{it.L('You must have an MQL5 community account to subscribe to trading signals. If you don’t have an account yet, please go to [_1]MQL5.com[_2] to register.', '<a href="https://www.mql5.com/en/auth_register">', '</a>')}</li>
                                            <li>{it.L('You’ll need to fund your MQL5 account to subscribe to paid signals. Learn [_1]how to fund your account[_2].', '<a href="https://www.mql5.com/en/articles/302#deposit">', '</a>')}</li>
                                            <li>{it.L('You can only subscribe to one signal provider with one [_1] account at any given time. You can use your signal on up to 3 computers.', it.website_name)}</li>
                                            <li>{it.L('You won’t be able to trade manually with the same [_1] MT5 account once you’ve subscribed to a signal.', it.website_name)}</li>
                                        </ol>
                                        <p>{it.L('Have more questions? Check out the [_1]FAQ section[_2] on the MQL5 website.', '<a href="https://www.mql5.com/en/forum/10773#q17">', '</a>')} </p>
                                        <div className='center-text gr-padding-20'>
                                            <a className='button' href={it.url_for('user/metatrader')}><span>{it.L('Go to the MT5 Terminal')}</span></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </TabContent>
                        <TabContent id='signal_provider'>
                            <div className='container gr-padding-20 gr-parent'>
                                <p className='text-align-center'>
                                    {it.L('If you are a professional trader, the MT5 trading signals service allows you to share your strategies with other traders for free or a subscription fee that you determine. When traders subscribe to your signal, your deals are automatically replicated on their accounts each time you place a trade.')}
                                </p>
                            </div>

                            <div className='fill-bg-color gr-padding-30 fullwidth' >
                                <div className='container gr-padding-30 gr-child'>
                                    <h2 className='center-text'>
                                        {it.L('Benefits of being a MT5 provider')}
                                    </h2>
                                    <div className='fill-bg-color gr-padding-30'>
                                        <div className='container section'>
                                            <div className='gr-padding-10 facts'>
                                                <div className='gr-row no-padding'>
                                                    <Box>
                                                        <BoxInner className='border-right-top' image='easy_setup' text={it.L('Easy to set up – no installation required.')} />
                                                        <BoxInner className='border-right-top' image='additional_income' text={it.L('Additional income stream from monthly subscriptions.')} />
                                                        <BoxInner className='border-right-top' image='automated_copy_trade' text={it.L('Automated copying – no extra work from you.')} />
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='gr-padding-30' >
                                <div className='container gr-padding-30 gr-child'>
                                    <h2 className='center-text'>
                                        {it.L('How to register as a signal provider')}
                                    </h2>
                                    <div className='gr-row gr-padding-30'>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='signal_provider-image' src={it.url_for('images/pages/mt5_signals/signal_provider_register_1.png')} />
                                            <ol>
                                                <li>{it.L('Go to the MQL5 signals showcase page and click on the [_1]Create signal[_2] button.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='signal_provider-image' src={it.url_for('images/pages/mt5_signals/signal_provider_register_2.png')} />
                                            <ol start='2'>
                                                <li>{it.L('Complete the form with your MT5 account credentials. In the Broker field, enter your account server name:')}
                                                    <ul className='bullet'>
                                                        <li>{it.L('[_1]Deriv-Demo[_2] if your signal is for demo accounts only.', '<strong>', '</strong>')}</li>
                                                        <li>{it.L('[_1]Deriv-Server[_2] or [_1]Deriv-Server-02[_2] if your signals is for real accounts only.', '<strong>', '</strong>')}</li>
                                                        <li>{it.L('(You can find the account server name on your [_1]MT5 dashboard[_2]).', `<a href=${it.url_for('user/metatrader')}>`, '</a>')}</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </div>
                                        <div className='gr-4 gr-12-m gr-padding-10 gr-child signal_provider-container'>
                                            <img className='signal_provider-image' src={it.url_for('images/pages/mt5_signals/signal_provider_register_3.png')} />
                                            <ol start='3'>
                                                <li>{it.L('Add a description and click [_1]Save[_2] to complete the registration.', '<strong>', '</strong>')}</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                <p>{it.L('[_1]Note:[_2] You need to upgrade your MQL5 account to seller status to be able to add a signal. If you’ve not upgraded yet, follow the steps on this page to register as a seller.', '<strong>', '</strong>')}
                                </p>
                                <div className='center-text gr-padding-20'>
                                    <a className='button' href={it.url_for('user/metatrader')}><span>{it.L('Go to the MT5 Terminal')}</span></a>
                                </div>
                            </div>

                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>

        </div>

        <div className='gr-padding-30 gr-child' />

    </div>
);

export default Mt5Signals;
