import React from 'react';
import { TabContainer, TabContent, TabContentContainer, TabsSubtabs } from '../_common/components/tabs.jsx';

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
    button_class = '',
    download = '',
}) => (
    <div className={`gr-5 gr-12-m gr-12-p center-text-p ${className || ''}`} data-show={data_show}>
        <div className='gr-12 gr-centered-m gr-centered-p'>
            <img className='responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
        </div>
        <div className='gr-padding-30'>
            <h3>{header}</h3>
            <strong>{description}</strong>
            <p>{text}</p>
            <div className='gr-row'>
                <div className='gr-12'>
                    { url &&
                        <a className={`button ${button_class}`} download={download || undefined} href={url} target={target || undefined} rel={/http/.test(url) ? 'noopener noreferrer' : undefined}><span>{button_text}</span></a>
                    }
                </div>
            </div>
        </div>
    </div>
);

const Platform = () => (
    <div className='static_full'>
        <div className='container'>
            <h1 className='center-text'>{it.L('Platforms')}</h1>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='platforms_tabs'
                    className='gr-padding-20 gr-parent tab-selector-wrapper'
                    items={[
                        { id: 'trading-platforms',       text: it.L('Trading Platforms') },
                        { id: 'charting-platforms',      text: it.L('Charting Platforms') },
                        { id: 'platforms_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='trading-platforms'>
                            <div className='gr-row gr-padding-30'>
                                <Platforms
                                    image='trading-page'
                                    header='SmartTrader'
                                    description={it.L('Premier binary options trading platform')}
                                    text={it.L('Trade in the world’s financial markets with a simple and user-friendly online platform.')}
                                    url={it.url_for('trading')}
                                    button_text={it.L('Trade Now')}
                                />
                                <div className='gr-2 gr-hide-m gr-hide-p' />
                                <div className='gr-12 gr-padding-30 gr-hide gr-show-m gr-show-p' />
                                <Platforms
                                    image='mt5'
                                    header={it.L('MetaTrader 5')}
                                    description={it.L('Advanced multi-asset trading platform')}
                                    text={it.L('Trade Forex and CFDs with a powerful platform recognised as the global standard.')}
                                    url={it.url_for('user/metatrader')}
                                    button_text={it.L('Access MT5 dashboard')}
                                />
                            </div>
                            <div className='gr-row gr-padding-30'>
                                <Platforms
                                    image='tick-trade'
                                    header={it.L('Binary Tick Trade App')}
                                    description={it.L('Ultra fast on-the-go trading')}
                                    text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                                    url='https://ticktrade.binary.com/download/ticktrade-app.apk'
                                    button_text={it.L('Download the Android App')}
                                    download='true'
                                />
                                <div className='gr-2 gr-hide-m gr-hide-p' />
                                <div className='gr-12 gr-padding-30 gr-hide gr-show-m gr-show-p' />
                                <Platforms
                                    image='webtrader'
                                    header={it.L('Binary WebTrader')}
                                    description={it.L('Advanced binary options trading interface')}
                                    text={it.L('Monitor the movements of your favourite assets and markets at the same time.')}
                                    url='https://webtrader.binary.com'
                                    target='_blank'
                                    button_text={it.L('Try WebTrader')}
                                />
                            </div>
                            <div className='gr-row gr-padding-30'>
                                <Platforms
                                    image='binarybot'
                                    header={it.L('Binary Bot')}
                                    description={it.L('Auto-trader programming tool')}
                                    text={it.L('Automate your trading strategies with our simple, "drag-and-drop" bot creation tool.')}
                                    url='https://bot.binary.com'
                                    target='_blank'
                                    button_text={it.L('Try Binary Bot')}
                                />
                                <div className='gr-2 gr-hide-m gr-hide-p' />
                                <div className='gr-12 gr-padding-30 gr-hide gr-show-m gr-show-p' />
                                <Platforms
                                    image='trading-multibarrier'
                                    header={it.L('Ladders')}
                                    className='financial-only'
                                    description={it.L('Multi-barrier trading')}
                                    text={it.L('Trade FX binary options on our multi-barrier platform, Ladders.')}
                                    url={it.url_for('multi_barriers_trading')}
                                    button_text={it.L('Trade now')}
                                />
                            </div>
                        </TabContent>
                        <TabContent id='charting-platforms'>
                            <div className='gr-row gr-padding-30'>
                                <Platforms
                                    image='tradingview'
                                    header={it.L('TradingView for [_1]', it.website_name)}
                                    description={it.L('Powerful charting and technical analysis')}
                                    text={it.L('Analyse the markets with an extensive range of indicators, price bands, and overlays.')}
                                    url='https://tradingview.binary.com'
                                    target='_blank'
                                    button_text={it.L('Try TradingView')}
                                />
                                <div className='gr-2 gr-hide-m gr-hide-p' />
                                <div className='gr-12 gr-padding-30 gr-hide gr-show-m gr-show-p' />
                                <Platforms
                                    image='chart'
                                    header={it.L('SmartCharts')}
                                    description={it.L('Interactive charting tool')}
                                    text={it.L('Analyse the financial markets using beautiful visualisations and unique trading tools, powered by a fast and intuitive interface.')}
                                    url='https://charts.binary.com'
                                    target='_blank'
                                    button_text={it.L('Try SmartCharts')}
                                />
                            </div>
                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>
        </div>
    </div>
);

export default Platform;
