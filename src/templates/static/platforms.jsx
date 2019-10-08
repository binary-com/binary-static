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
    status,
    url = '',
    target,
    button_text,
    download = '',
}) => (
    <div className={`gr-row gr-padding-30 ${className || ''}`} data-show={data_show}>
        <div className='gr-4 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m center-text no-center-text-p-m'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-8 gr-12-m gr-12-p'>
            <h3 className={`section-title ${status === 'beta' ? '' : status || ''}`}>{header}{status === 'beta' ? <span className='beta'>{it.L('BETA')}</span> : ''}</h3>
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

const PlatformsGridApp = ({
    className,
    data_show,
    image_path = 'platforms',
    image,
    header,
    status,
    description,
    text,
    url = '',
    target,
}) => (
    <div className={`gr-row gr-padding-30 ${className || ''}`} data-show={data_show}>
        <div className='gr-4 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m center-text no-center-text-p-m align-self-center'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-8 gr-12-m gr-12-p'>
            <h3 className={`section-title ${status || ''}`}>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    <p>
                        <a className='button-secondary android-download-grid-app download-grid-app' href={url} target={target || undefined}><span>{it.L('Download for Android')}</span></a>
                        <span className='ios-download-grid-app invisible'>{it.L('Binary Grid is currently only available on Android devices.')}</span>
                        <span className='divider-sm' />
                    </p>
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
        <div className='fill-bg-color gr-padding-30 mobile-hide' data-show='-eucountry'>
            <div className='container gr-padding-30 gr-child'>
                <h2 className='primary-color center-text'>
                    {it.L('Deriv — an all-new trading experience')}
                    <span className='beta'>{it.L('BETA')}</span>
                </h2>
                <div className='gr-row gr-row-align-around'>
                    <div className='gr-5 gr-12-p gr-12-m'>
                        <ul className='bullet b-m-md'>
                            <li>
                                <strong>{it.L('Powerful and intuitive')}</strong>
                                <br />
                                {it.L('Easy to use and feature-rich.')}
                            </li>
                            <li>
                                <strong>{it.L('Quick access to your favourite markets')}</strong>
                                <br />
                                {it.L('World markets at your fingertips.')}
                            </li>
                            <li>
                                <strong>{it.L('Easily monitor your open positions')}</strong>
                                <br />
                                {it.L('Keep track of all ongoing contracts.')}
                            </li>
                        </ul>
                    </div>
                    <div className='gr-5 gr-12-p gr-12-m center-text align-self-center'>
                        <img className='responsive header-img' src={it.url_for('images/pages/platforms/deriv-app.png')} />
                    </div>

                </div>
                <div className='center-text'>
                    <p>{it.L('Go ahead, experience it for yourself.')}</p>
                    <p><a className='button' href='https://deriv.app/?utm_source=binary&utm_medium=referral&utm_campaign=platforms_page' target='_blank' rel='noopener noreferrer'><span>{it.L('Try Deriv now')}</span></a></p>
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
                                image='deriv-app'
                                data_show='-eucountry'
                                header='Deriv'
                                status='beta'
                                className='mobile-hide'
                                description={it.L('The next-gen online trading experience')}
                                text={it.L('A whole new easy-to-use platform that\'s rich with features.')}
                                url='https://deriv.app/?utm_source=binary&utm_medium=referral&utm_campaign=platforms_page'
                                target='_blank'
                                button_text={it.L('Trade now')}
                            />
                            <Platforms
                                image='trading-page'
                                header='SmartTrader'
                                description={it.L('Premier binary options trading platform')}
                                text={it.L('Trade in the world\'s financial markets with a simple and user-friendly online platform.')}
                                url={it.url_for('trading')}
                                button_text={it.L('Trade now')}
                            />
                            <PlatformsGridApp
                                image='grid-app-sm'
                                data_show='-eucountry'
                                status='new'
                                header={it.L('Binary Grid')}
                                description={it.L('Micro-trading on the go')}
                                text={it.L('In the new, exciting Binary Grid, win whenever the trade ends outside your selected cell.')}
                                url={it.url_for('binary-grid')}
                                target='_blank'
                            />
                            <Platforms
                                image='tick-trade'
                                header={it.L('Tick Trade Android App')}
                                description={it.L('Ultra fast on-the-go trading')}
                                text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                                url='https://ticktrade.binary.com/download/ticktrade-app.apk'
                                button_text={it.L('Download Tick Trade App')}
                                download='true'
                            />
                            <PlatformsDesktop
                                image='devices'
                                header={it.L('[_1] desktop app', it.website_name)}
                                className='desktop-app invisible financial-only'
                                description={it.L('Enhanced performance. Intuitively simple.')}
                                text={it.L('Access our products and services from a single app.')}
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
                        header={it.L('TradingView')}
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
