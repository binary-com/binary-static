import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const DownloadBlock = ({
   badge,
   desc,
   download,
   href,
   image,
   os,
   target,
   title,
}) => (
    <div className='gr-4 gr-6-m gr-padding-10'>
        <img className='gr-6 gr-centered' src={it.url_for(`images/pages/metatrader/icons/${image}.svg`)} />
        <h3>{title}</h3>
        <p>{desc }</p>
        <a className={!badge ? 'button' : undefined} href={os ? `https://download.mql5.com/cdn/mobile/mt5/${os}?server=Binary.com-Server` : href } download={download || undefined} target={target || undefined}>
            <span className={badge || undefined}>{badge ? '' : it.L('Download')}</span>
        </a>
    </div>
);

const Download = () => (
    <div id='mt_download' className='static_full center-text'>
        <h1>{it.L('Start Trading with MetaTrader 5') }</h1>
        <h3>{it.L('Trade with a powerful interface known as the global industry standard.') }</h3>

        <div className='gr-padding-20'>
            <h3>{it.L('For Desktop') }</h3>
            <p>{it.L('Download MT5 for your desktop or laptop to access the powerful tools and features enjoyed by millions of traders.') }</p>
            <div className='gr-row'>
                <DownloadBlock
                    title={it.L('Windows')}
                    desc={it.L('Windows 7 or later')}
                    image='windows'
                    href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe'
                />
                <DownloadBlock
                    title={it.L('MacOS')}
                    desc={it.L('All versions of MacOS')}
                    image='apple'
                    href='https://s3.amazonaws.com/binary-mt5/binary-mt5.dmg'
                    download='true'
                />
                <DownloadBlock
                    title={it.L('Linux')}
                    desc={it.L('All versions of Linux')}
                    image='linux'
                    href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux'
                    target='_blank'
                />
            </div>
            <p className='foot-note gr-padding-20'>{it.L('The MetaTrader platform will no longer support Windows XP, Windows 2003, and Windows Vista after 01 October, 2017.') }</p>
        </div>

        <SeparatorLine no_wrapper />

        <div className='gr-padding-20'>
            <h3>{it.L('For Mobile') }</h3>
            <p>{it.L('Access the markets anytime, anywhere using native apps for your iOS or Android devices.') }</p>
            <div className='gr-row'>
                <div className='gr-2 gr-hide-m' />
                <DownloadBlock
                    image='android'
                    os='android'
                    title={it.L('Android')}
                    desc={it.L('All versions of Android')}
                    target='_blank'
                    badge='google-play-badge'
                />
                <DownloadBlock
                    image='apple'
                    os='ios'
                    title={it.L('iOS')}
                    desc={it.L('All versions of iOS')}
                    target='_blank'
                    badge='app-store-badge'
                />
            </div>
        </div>

        <SeparatorLine no_wrapper />

        <div className='gr-padding-20'>
            <h3>{it.L('For Browser') }</h3>
            <p>{it.L('Use the web platform from any Windows, MacOS, or Linux operating system – no download or installation required.') }</p>
            <div className='gr-row'>
                <div className='gr-8 gr-push-2 gr-8-p gr-push-2-p gr-12-m gr-push-0-m gr-padding-10 gr-parent'>
                    <div className='gr-row browsers'>
                        {['chrome', 'safari', 'firefox', 'edge', 'opera'].map((browser, idx) => (
                            <img key={idx} className='gr-centered' src={it.url_for(`images/pages/metatrader/icons/${browser}.svg`)} />
                        ))}
                    </div>
                </div>
            </div>
            <h3>{it.L('Browser platforms') }</h3>
            <p>{it.L('We support and prefer to use the above browser platforms') }</p>
            <div className='center-text'>
                <a className='button' href='https://trade.mql5.com/trade?servers=Binary.com-Server&amp;trade_server=Binary.com-Server' target='_blank' rel='noopener noreferrer'>
                    <span>{it.L('Go') }</span>
                </a>
            </div>
        </div>
    </div>
);

export default Download;
