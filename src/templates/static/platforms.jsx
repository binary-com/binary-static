import React from 'react';

const Platforms = ({
    image_class,
    image_path = 'platforms',
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
            <img className='responsive' src={it.url_for(`images/pages/${image_path}/${image}.png`)} />
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
                    <div className='google-play-badge' />
                </a>
            </div>
            }
        </div>
    </div>
);

const Platform = () => (
    <div className='static_full'>
        <div className='container'>
            <h1 className='center-text'>{it.L('Trading Platforms')}</h1>

            <div className='gr-row gr-padding-30'>
                <Platforms
                    image_class='gr-12 gr-7-p gr-10-m'
                    image='trading-page'
                    header='SmartTrader'
                    description={it.L('Premier binary options trading platform')}
                    text={it.L('Trade in the world’s financial markets with a simple and user-friendly online platform.')}
                    url={it.url_for('trading')}
                    button_text={it.L('Trade Now')}
                />
                <div className='gr-2' />
                <Platforms
                    image_class='gr-12 gr-7-p gr-10-m'
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
                    image_class='gr-7 gr-5-p gr-7-m'
                    image='tick-trade'
                    header={it.L('Binary Tick Trade App')}
                    description={it.L('Ultra fast on-the-go trading')}
                    text={it.L('Enjoy our fastest type of trading with our Tick Trade app, wherever you are.')}
                    google_play_url='https://play.google.com/store/apps/details?id=com.binary.ticktrade&referrer=utm_source%3Dbinary-com%26utm_medium%3Dreferrer%26utm_campaign%3Dplatforms_page'
                />
                <div className='gr-2' />
                <Platforms
                    image_class='gr-8 gr-5-p gr-7-m'
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
                    image_class='gr-10 gr-7-p gr-9-m'
                    image='binarybot'
                    header={it.L('Binary Bot')}
                    description={it.L('Auto-trader programming tool')}
                    text={it.L('Automate your trading strategies with our simple, "drag-and-drop" bot creation tool.')}
                    url='https://bot.binary.com'
                    target='_blank'
                    button_text={it.L('Try Binary Bot')}
                />
                <div className='gr-2' />
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
            <div className='gr-row gr-padding-30' data-show='default, virtual, costarica'>
                <Platforms
                    image_class='gr-10 gr-7-p gr-9-m'
                    image='trading-multibarrier'
                    header={it.L('Japanese Ladders')}
                    description={it.L('Multi-barrier trading')}
                    text={it.L('Trade FX binary options on our multi-barrier platform, designed to fully comply with Japanese regulations.')}
                    url={it.url_for('multi_barriers_trading')}
                    button_text={it.L('Trade now')}
                />
            </div>
        </div>
    </div>
);

export default Platform;
