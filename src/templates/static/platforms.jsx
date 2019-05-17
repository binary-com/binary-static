import React            from 'react';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs }        from '../_common/components/tabs.jsx';
import { SeparatorLine } from '../_common/components/separator_line.jsx';

const Platforms = ({
    className,
    data_show,
    image_path = 'platforms',
    image,
    header,
    description,
    text,
    url = '',
    target,
    button_text,
    download = '',
}) => (
    <div className={`gr-row gr-padding-30 ${className || ''}`} data-show={data_show}>
        <div className='gr-4 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m center-text no-center-text-p-m fill-bg-color'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-8 gr-12-m gr-12-p'>
            <h3>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    { url &&
                        <a className='button-secondary' download={download || undefined} href={url} target={target || undefined} rel={/http/.test(url) ? 'noopener noreferrer' : undefined}><span>{button_text}</span></a>
                    }
                </div>
            </div>
        </div>
    </div>
);

const PlatformsDesktop = ({
    className,
    data_show,
    image_path = 'platforms',
    image,
    header,
    description,
    text,
}) => (
    <div className={`gr-row gr-padding-30 ${className || ''}`} data-show={data_show}>
        <div className='gr-4 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m center-text no-center-text-p-m'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.svg`)} />
        </div>
        <div className='gr-8 gr-12-m gr-12-p'>
            <h3>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    <DownloadApp push='4' image='mac' />
                    <DownloadApp push='6' image='windows' />
                    {/* <DownloadApp image='linux' /> */}
                </div>
            </div>
        </div>
    </div>
);

const PlatformsSmall = ({
    className,
    data_show,
    image_path = 'platforms',
    image,
    header,
    description,
    text,
    url = '',
    target,
    button_text,
    download = '',
}) => (
    <div className={`gr-6 gr-12-m gr-12-p center-text-p ${className || ''}`} data-show={data_show}>
        <div className='gr-12 gr-centered-m gr-centered-p'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-padding-30'>
            <h3>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    { url &&
                        <a className='button-secondary' download={download || undefined} href={url} target={target || undefined} rel={/http/.test(url) ? 'noopener noreferrer' : undefined}><span>{button_text}</span></a>
                    }
                </div>
            </div>
        </div>
    </div>
);

const DownloadApp = ({ image }) => (
    <div className='download-app'>
        <a id={`app_${image}`}><img src={it.url_for(`images/pages/platforms/${image}.svg`)} /></a>
    </div>
);

const Platform = () => (
    <div className='static_full'>
        <div className='container'>
            <h1 className='center-text'>{it.L('Platforms')}</h1>
            <p className='center-text gr-padding-20 gr-parent'>{it.L('Explore all the trading platforms, apps, and tools we offer')}</p>
        </div>
        <div className='fill-bg-color gr-padding-30 binary-grid-app'>
            <div className='container gr-padding-30 gr-child'>
                <h2 className='primary-color center-text'>
                    <span>{it.L('Introducing Binary Grid')}</span>
                    <span><img id='new_badge' src={it.url_for('images/pages/platforms/new_badge.svg')} /></span>
                </h2>
                <p className='center-text'>{it.L('Our exciting new mobile trading app')}</p>
                <div className='gr-row gr-row-align-around'>
                    <div className='gr-5 gr-12-p gr-12-m'>
                        <ul className='bullet'>
                            <li>
                                <strong>{it.L('Limited risks')}</strong>
                                <br />
                                {it.L('Get started with stakes as low as 20¢.')}
                            </li>
                            <li>
                                <strong>{it.L('Multiple contracts at a time')}</strong>
                                <br />
                                {it.L('Open several positions across multiple cells simultaneously.')}
                            </li>
                            <li>
                                <strong>{it.L('Speed of touch')}</strong>
                                <br />
                                {it.L('Trade in the moment with your touch screen device.')}
                            </li>
                        </ul>
                    </div>
                    <div className='gr-5 gr-12-p gr-12-m center-text align-self-center'>
                        <img className='responsive header-img' src={it.url_for('images/pages/platforms/grid-app.png')} />
                    </div>

                </div>
                <div className='center-text'>
                    <p>{it.L('Download Binary Grid for Android now')}</p>
                    <p><a className='button download-grid-app'><span>{it.L('Download')}</span></a></p>
                </div>
            </div>
        </div>
        <div className='gr-padding-30 gr-child' />
        <div className='container'>
            <h2 className='primary-color center-text gr-padding-30 gr-child'>{it.L('Trading platforms')}</h2>
            <p className='center-text gr-padding-30 gr-parent'>{it.L('Find a trading platform that suits your experience and preferred strategy – whether you\'re a new or seasoned trader.')}</p>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='platforms_tabs'
                    className='gr-padding-20 gr-parent tab-selector-wrapper'
                    items={[
                        { id: 'beginner',                text: it.L('Beginner') },
                        { id: 'advanced',                text: it.L('Advanced') },
                        { id: 'platforms_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='beginner'>
                            <Platforms
                                image='trading-page'
                                header='SmartTrader'
                                description={it.L('Premier binary options trading platform')}
                                text={it.L('Trade in the world\'s financial markets with a simple and user-friendly online platform.')}
                                url={it.url_for('trading')}
                                button_text={it.L('Trade now')}
                            />
                            <Platforms
                                image='grid-app-sm'
                                header={it.L('Binary Grid')}
                                description={it.L('Micro-trading on the go')}
                                text={it.L('Seamless trading on your mobile device, at the speed of touch.')}
                                url='https://grid.binary.me/download/BinaryGrid_v101.apk'
                                button_text={it.L('Download Binary Grid')}
                                download='true'
                            />
                            <Platforms
                                image='tick-trade'
                                header={it.L('Binary Tick Trade App')}
                                description={it.L('Ultra fast on-the-go trading')}
                                text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                                url='https://ticktrade.binary.com/download/ticktrade-app.apk'
                                button_text={it.L('Download the Android app')}
                                download='true'
                            />
                            <Platforms
                                image='trading-multibarrier'
                                header={it.L('Ladders')}
                                className='financial-only'
                                description={it.L('Multi-barrier trading')}
                                text={it.L('Trade FX binary options on our multi-barrier platform, Ladders.')}
                                url={it.url_for('multi_barriers_trading')}
                                button_text={it.L('Trade now')}
                            />
                            <PlatformsDesktop
                                image='devices'
                                header={it.L('[_1] desktop app', it.website_name)}
                                className='desktop-app financial-only'
                                description={it.L('Enhanced performance. Intuitively simple.')}
                                text={it.L('Access out products and services from a single app.')}
                            />
                        </TabContent>
                        <TabContent id='advanced'>
                            <Platforms
                                image='mt5'
                                header={it.L('MetaTrader 5')}
                                description={it.L('Advanced multi-asset trading platform')}
                                text={it.L('Trade Forex, CFDs, and binary options with a powerful platform recognised as the global standard.')}
                                url={it.url_for('user/metatrader')}
                                button_text={it.L('Access MT5 dashboard')}
                            />
                            <Platforms
                                image='webtrader'
                                header={it.L('Binary WebTrader')}
                                description={it.L('Advanced binary options trading interface')}
                                text={it.L('Monitor the movements of your favourite assets and markets at the same time.')}
                                url='https://webtrader.binary.com'
                                target='_blank'
                                button_text={it.L('Try WebTrader')}
                            />
                            <Platforms
                                image='binarybot'
                                header={it.L('Binary Bot')}
                                description={it.L('Auto-trader programming tool')}
                                text={it.L('Automate your trading strategies with our simple, "drag-and-drop" bot creation tool.')}
                                url='https://bot.binary.com'
                                target='_blank'
                                button_text={it.L('Try Binary Bot')}
                            />
                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>

            <SeparatorLine />

            <div className='gr-padding-30'>
                <h2 className='primary-color center-text gr-padding-30 gr-child'>{it.L('Charting platforms')}</h2>
                <p className='center-text gr-padding-30 gr-parent'>{it.L('Study financial data to forecast market movements using our charting tools.')}</p>
                <div className='gr-row'>
                    <PlatformsSmall
                        image='tradingview'
                        header={it.L('TradingView for [_1]', it.website_name)}
                        description={it.L('Powerful charting and technical analysis')}
                        text={it.L('Analyse the markets with an extensive range of indicators, price bands, and overlays.')}
                        url='https://tradingview.binary.com'
                        target='_blank'
                        button_text={it.L('Try TradingView')}
                    />
                    <div className='gr-12 gr-padding-30 gr-hide gr-show-m gr-show-p' />
                    <PlatformsSmall
                        image='chart'
                        header={it.L('SmartCharts')}
                        description={it.L('Interactive charting tool')}
                        text={it.L('Analyse the financial markets using beautiful visualisations and unique trading tools, powered by a fast and intuitive interface.')}
                        url='https://charts.binary.com'
                        target='_blank'
                        button_text={it.L('Try SmartCharts')}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default Platform;
