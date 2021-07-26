import React            from 'react';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs,
} from '../_common/components/tabs.jsx';
import { SeparatorLine } from '../_common/components/separator_line.jsx';
import Loading from '../_common/components/loading.jsx';

const Platforms = ({
    className,
    data_show,
    image_path = 'platforms',
    image,
    header,
    description,
    text,
    buttons,
}) => (
    <div className={`gr-row gr-padding-30 ${className || ''}`} data-show={data_show}>
        <div className='gr-4 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m center-text no-center-text-p-m'>
            <img className='platform responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-8 gr-12-m gr-12-p'>
            <h3 className='section-title'>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    {buttons && buttons.map(button =>
                        <a
                            key={button.text}
                            style={{ display: 'inline-block', marginRight: '5px' }}
                            className='button-secondary'
                            download={button.download || undefined}
                            href={button.url}
                            target={button.target || undefined}
                            rel={/http/.test(button.url) ? 'noopener noreferrer' : undefined}
                        >
                            <span>{button.text}</span>
                        </a>
                    )}
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
                    {url &&
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
    <div>
        <Loading id='loading_image' />
        <div className='static_full invisible' id='static_full'>
            <div className='container'>
                <h1 className='center-text'>{it.L('Platforms')}</h1>
                <p className='center-text gr-padding-20 gr-parent'>{it.L('Explore all the trading platforms, apps, and tools we offer')}</p>
            </div>
            <div className='fill-bg-color gr-padding-30' data-show='-eucountry'>
                <div className='container gr-padding-30 gr-child'>
                    <h2 className='primary-color center-text'>
                        {it.L('Introducing Deriv.com')}
                    </h2>
                    <p className='center-text gr-child'>{it.L('A rebranding of [_1] to an all-new trading experience', it.website_name)}</p>
                    <div className='gr-row gr-row-align-around'>
                        <div className='gr-5 gr-12-p gr-12-m'>
                            <ul className='bullet b-m-md'>
                                <li>
                                    {it.L('A single, comprehensive trading service with [_1]4 advanced platforms[_2]', '<strong>', '</strong>')}
                                </li>
                                <li>
                                    {it.L('A sharp design with [_1]user-friendly[_2] interface', '<strong>', '</strong>')}
                                </li>
                                <li>
                                    {it.L('More [_1]financial instruments[_2] to trade as you please', '<strong>', '</strong>')}
                                </li>
                                <li>
                                    {it.L('[_1]24/7 customer support[_2] to enhance your trading experience', '<strong>', '</strong>')}
                                </li>
                            </ul>
                        </div>
                        <div className='gr-5 gr-12-p gr-12-m center-text align-self-center'>
                            <img className='responsive header-img' src={it.url_for('images/pages/platforms/deriv-app.png')} />
                        </div>

                    </div>
                    <div className='center-text'>
                        <p>{it.L('No sign up required. Easily log in with your [_1] credentials.', it.website_name)}</p>
                        <p><a className='button' href='https://deriv.com/interim/faq/?utm_source=binary&utm_medium=referral&utm_campaign=deriv-launch&utm_content=page-platforms-banner' target='_blank' rel='noopener noreferrer'><span>{it.L('Learn more about Deriv.com')}</span></a></p>
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
                            { id: 'beginner', text: it.L('Beginner') },
                            { id: 'advanced', text: it.L('Advanced') },
                            { id: 'platforms_tabs_selector', className: 'tab-selector' },
                        ]}
                    />
                    <div className='tab-content'>
                        <TabContentContainer>
                            <TabContent id='beginner'>
                                <Platforms
                                    image='deriv-app'
                                    data_show='-eucountry'
                                    header='Deriv.com'
                                    description={it.L('The next-gen online trading experience')}
                                    text={it.L('A whole new easy-to-use platform that\'s rich with features.')}
                                    buttons={[
                                        { text: it.L('Try Deriv.com now'), url: 'https://app.deriv.com/?utm_source=binary&utm_medium=referral&utm_campaign=deriv-launch&utm_content=page-platforms-button-trade-now', target: '_blank' },
                                    ]}
                                />
                                <Platforms
                                    image='trading-page'
                                    header='SmartTrader'
                                    description={it.L('Premier binary options trading platform')}
                                    text={it.L('Trade in the world\'s financial markets with a simple and user-friendly online platform.')}
                                    buttons={[
                                        { text: it.L('Trade now'), url: it.url_for('trading') },
                                    ]}
                                />
                                <Platforms
                                    image='tick-trade'
                                    header={it.L('Tick Trade Android App')}
                                    description={it.L('Ultra fast on-the-go trading')}
                                    text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                                    buttons={[
                                        { text: it.L('Download Tick Trade App'), url: 'https://ticktrade.binary.com/download/ticktrade-app.apk', download: 'true' },
                                    ]}
                                />
                                {/* TODO: Uncomment this when P2P Mobile app is ready */}
                                {/* <Platforms
                                    image='dp2p-app'
                                    header={it.L('DP2P app')}
                                    description={it.L('Peer-to-peer fiat exchange')}
                                    text={it.L('The fast, easy, and convenient way to make deposits and withdrawals with zero commission fees.')}
                                    buttons={[
                                        { text: it.L('Download DP2P app'), url: '', download: 'true' },
                                    ]}
                                /> */}
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
                                    text={it.L('Trade forex and CFDs with a powerful platform recognised as the global standard.')}
                                    buttons={[
                                        { text: it.L('Access MT5 dashboard'), url: it.url_for('user/metatrader') },
                                        { text: it.L('Download MT5'), url: it.url_for('metatrader/download') },
                                    ]}
                                />
                                <Platforms
                                    image='webtrader'
                                    header={it.L('Binary WebTrader')}
                                    description={it.L('Advanced binary options trading interface')}
                                    text={it.L('Monitor the movements of your favourite assets and markets at the same time.')}
                                    buttons={[
                                        { text: it.L('Try WebTrader'), url: 'https://webtrader.binary.com', target: '_blank' },
                                    ]}
                                />
                                <Platforms
                                    image='binarybot'
                                    header={it.L('Binary Bot')}
                                    description={it.L('Auto-trader programming tool')}
                                    text={it.L('Automate your trading strategies with our simple, "drag-and-drop" bot creation tool.')}
                                    buttons={[
                                        { text: it.L('Try Binary Bot'), url: 'https://bot.binary.com', target: '_blank' },
                                    ]}
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
    </div>
);

export default Platform;
