import React from 'react';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../_common/components/tabs.jsx';

const Platforms = ({
    image_class,
    image,
    header,
    description,
    text,
    url = '',
    target,
    button_text,
    google_play_url = '',
}) => (
    <div className='gr-5 gr-12-m gr-12-p'>
        <div className={image_class}>
            <img className='responsive' src={it.url_for(`images/pages/platforms/${image}.png`)} />
        </div>
        <div className='gr-padding-30'>
            <h3>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            { url &&
                <p>
                    <a className='button' href={url} target={target || undefined} rel={/http/.test(url) ? 'noopener noreferrer' : undefined}><span>{button_text}</span></a>
                </p>
            }
            { google_play_url &&
                <div className='gr-row'>
                    <a className='gr-5 gr-6-m' href={google_play_url} target='_blank' rel='noopener noreferrer'>
                        <div className='google-play-badge'></div>
                    </a>
                </div>
            }
    </div>
</div>
);

const EnhancedItems = ({ image, text }) => (
    <div className='gr-4 gr-6-p gr-12-m gr-padding-20 gr-parent'>
        <img className='responsive' src={it.url_for(`images/pages/platforms/mt5/${image}.svg`)} alt='' />
        <p className='no-margin'>{text}</p>
    </div>
);

const Steps = ({ items = [] }) => (
    <div className='steps gr-row'>
        { items.map((step, idx) => (
            <div key={idx} className='gr-4 gr-12-m gr-no-gutter gr-padding-30 gr-parent'>
                <div className='step'>
                    <div className='border-bottom'></div>
                    <div className='circle'>{idx + 1}</div>
                    <div className='gr-padding-20 gr-parent gr-gutter center-text'>
                        <img className='gr-6 gr-centered' src={it.url_for(`images/pages/platforms/mt5/step${idx + 1}.svg`)} />
                        <p className='no-margin'>{step.text}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const Platform = () => (
    <div className='static_full'>
        <div className='container'>
            <h1 className='center-text'>{it.L('Trading Platforms')}</h1>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='platforms_tabs'
                    className='gr-padding-20 gr-parent tab-selector-wrapper invisible'
                    items={[
                        { id: 'binary', text: it.L('Binary Options') },
                        { id: 'mt5',    text: it.L('MetaTrader 5') },
                        { id: 'platforms_tabs_selector', className: 'tab-selector' },
                    ]}
                />

                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='binary'>
                            <div id='binary' className='container'>
                                <div className='gr-row gr-padding-30'>
                                    <Platforms
                                        image_class='gr-12 gr-7-p gr-10-m'
                                        image='trading-page'
                                        header={it.website_name}
                                        description={it.L('Premier binary options trading platform')}
                                        text={it.L('Trade in the world’s financial markets with a simple and user-friendly online platform.')}
                                        url={it.url_for('trading')}
                                        button_text={it.L('Trade Now')}
                                    />
                                    <div className='gr-2'></div>
                                    <Platforms
                                        image_class='gr-7 gr-5-p gr-7-m'
                                        image='tick-trade'
                                        header={it.L('Binary Tick Trade App')}
                                        description={it.L('Ultra fast on-the-go trading')}
                                        text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                                        google_play_url='https://play.google.com/store/apps/details?id=com.binary.ticktrade&referrer=utm_source%3Dbinary-com%26utm_medium%3Dreferrer%26utm_campaign%3Dplatforms_page'
                                    />
                                </div>
                                <div className='gr-row gr-padding-30'>
                                    <Platforms
                                        image_class='gr-8 gr-5-p gr-7-m'
                                        image='webtrader'
                                        header={it.L('Binary Webtrader')}
                                        description={it.L('Advanced binary options trading interface')}
                                        text={it.L('Monitor the movements of your favourite assets and markets at the same time.')}
                                        url='https://webtrader.binary.com'
                                        target='_blank'
                                        button_text={it.L('Try Webtrader')}
                                    />
                                    <div className='gr-2'></div>
                                    <Platforms
                                        image_class='gr-12 gr-7-p gr-10-m'
                                        image='nextgen'
                                        header={it.L('Binary Next-Gen')}
                                        description={it.L('Advanced trading app for web and mobile')}
                                        text={it.L('Explore advanced trading features with the Next-Gen app for web and mobile.')}
                                        url='https://app.binary.com'
                                        target='_blank'
                                        button_text={it.L('Try Next-Gen')}
                                        google_play_url='https://play.google.com/store/apps/details?id=app.binary.com&referrer=utm_source%3Dbinary-com%26utm_medium%3Dreferrer%26utm_campaign%3Dplatforms_page'
                                    />
                                </div>
                                <div className='gr-row gr-padding-30'>
                                    <Platforms
                                        image_class='gr-10 gr-7-p gr-9-m'
                                        image='binarybot'
                                        header={it.L('Binary Bot')}
                                        description={it.L('Auto-trader programming tool')}
                                        text={it.L('Automate your trading strategies with our simple, "drag-and-drop" bot creation tool.')}
                                        url='https://bot.binary.com'
                                        target='_blank'
                                        button_text={it.L('Try Binary Bot')}
                                    />
                                    <div className='gr-2'></div>
                                    <Platforms
                                        image_class='gr-10 gr-5-p gr-9-m'
                                        image='tradingview'
                                        header={it.L('TradingView for [_1]', it.website_name)}
                                        description={it.L('Powerful charting and technical analysis')}
                                        text={it.L('Analyse the markets with an extensive range of indicators, price bands, and overlays.')}
                                        url='https://tradingview.binary.com'
                                        target='_blank'
                                        button_text={it.L('Try TradingView')}
                                    />
                                </div>
                            </div>
                        </TabContent>

                        <TabContent id='mt5'>
                            <div id='mt5'>
                                <div className='container'>
                                    <h2 className='center-text'>{it.L('Introducing MetaTrader 5 for [_1]', it.website_name)}</h2>
                                    <p className='center-text'>{it.L('MetaTrader 5 is an institutional multi-asset platform offering outstanding trading possibilities and technical analysis tools. It allows trading Foex, Stocks, Futures, CFDs and it provides everything needed for full-fledged and flexible trading operations.')}</p>
                                    <div className='gr-row gr-padding-30'>
                                        <div className='gr-6 gr-12-m gr-padding-30 gr-parent'>
                                            <img className='responsive' src={it.url_for('images/pages/home/mt5.png')} />
                                        </div>
                                        <div className='gr-5 gr-push-1 gr-12-m gr-push-0-m'>
                                            <h3>{it.L('MetaTrader 5')}</h3>
                                            <p>{it.L('[_1] enters Forex and CFD trading with the universally acclaimed MetaTrader 5 to its continued leadership presence in the binary options market.', it.website_name)}</p>
                                            <p>{it.L('Trade Forex and Contracts for Difference (CFD) assets with highly-competitive leverage and zero commission.')}</p>
                                            <p>
                                                <a className='button' href={it.url_for('user/metatrader')}>
                                                    <span>{it.L('Create MetaTrader 5 Account in [_1]', it.website_name)}</span>
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='gr-padding-10 fill-bg-color'>
                                    <div className='container gr-padding-30'>
                                        <h2 className='center-text'>{it.L('Enhanced Trading with MetaTrader 5')}</h2>
                                        <div className='gr-row center-text enhanced'>
                                            <EnhancedItems image='trade'      text={it.L('Trade Forex and CFD asset classes with an award winning broker')} />
                                            <EnhancedItems image='leverage'   text={it.L('Trade the Forex markets with leverage up to 100:1, and Volatility Indices with leverage up to 500:1')} />
                                            <EnhancedItems image='demo'       text={it.L('Open a free Demo account. Upgrade to a Real account by depositing funds through your [_1] account cashier', it.website_name)} />
                                            <EnhancedItems image='tools'      text={it.L('Access advanced tools for fundamental and technical analysis, all available in one platform')} />
                                            <EnhancedItems image='algorithms' text={it.L('Subscribe to a wide range of algorithmic trading strategies from the built-in MetaTrader Market')} />
                                            <EnhancedItems image='platforms'  text={it.L('Trade using the mobile and desktop apps, or use the web platform from any web browser')} />
                                        </div>
                                    </div>
                                </div>

                                <div className='container gr-padding-30'>
                                    <h2 className='center-text gr-padding-20'>{it.L('Trade with a powerful interface provided')}</h2>
                                    <div className='gr-row gr-padding-30 gr-parent'>
                                        <div className='gr-6 gr-12-m'>
                                            <img className='responsive' src={it.url_for('images/pages/platforms/mt5/interface.svg')} alt='' />
                                        </div>
                                        <div className='gr-5 gr-push-1 gr-12-m gr-push-0-m'>
                                            <p>{it.L('We provide powerful interface platforms of desktop, mobile and browsers.')}</p>
                                            <div className='gr-row'>
                                                <div className='gr-6'>
                                                    <ul className='checked'>
                                                        <li>{it.L('iOS')}</li>
                                                        <li>{it.L('Android')}</li>
                                                        <li>{it.L('Windows')}</li>
                                                        <li>{it.L('MacOS')}</li>
                                                        <li>{it.L('Linux')}</li>
                                                    </ul>
                                                </div>
                                                <div className='gr-6'>
                                                    <ul className='checked'>
                                                        <li>{it.L('Chrome')}</li>
                                                        <li>{it.L('Safari')}</li>
                                                        <li>{it.L('Firefox')}</li>
                                                        <li>{it.L('Edge')}</li>
                                                        <li>{it.L('Opera')}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p className='center-text'>
                                                <a className='button button-secondary full-width' href={it.url_for('metatrader/download')}>
                                                    <span>{it.L('Learn more')}</span>
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <h2 className='center-text gr-padding-30'>{it.L('How to start trading with MetaTrader 5?')}</h2>
                                    <div className='gr-row center-text'>
                                        <Steps items={[
                                            { text: it.L('Open a [_1] account', it.website_name) },
                                            { text: it.L('Create a MetaTrader 5 account') },
                                            { text: it.L('Make a deposit into your account and start trading') },
                                        ]} />
                                    </div>
                                    <div className='center-text'>
                                        <a className='button' href={it.url_for('user/metatrader')}>
                                            <span>{it.L('Create MetaTrader 5 Account in [_1]', it.website_name)}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>
        </div>
    </div>
);

export default Platform;
