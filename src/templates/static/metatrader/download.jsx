import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const DownloadBlock = ({ badge, desc, download, href, image, os, target, title }) => (
    <div className='gr-4 gr-6-m gr-padding-10'>
        <img className='gr-6 gr-centered' src={it.url_for(`images/pages/metatrader/icons/${image}.svg`)} />
        <h3>{title}</h3>
        <p>{desc}</p>
        <a
            className={!badge ? 'button' : undefined}
            href={os ? `https://download.mql5.com/cdn/mobile/mt5/${os}?server=Binary.com-Server` : href}
            download={download || undefined}
            target={target || undefined}
        >
            <span className={badge || undefined}>{badge ? '' : it.L('Download')}</span>
        </a>
    </div>
);

const DesktopDownloadBlock = ({ badge, desc, download, href, image, os, target, title, id }) => (
    <div className='gr-12 gr-12-m gr-padding-10 invisible download-block' id={id}>
        <img className='gr-6 gr-centered' src={it.url_for(`images/pages/metatrader/icons/${image}.svg`)} />
        <a
            className={!badge ? 'button' : undefined}
            href={os ? `https://download.mql5.com/cdn/mobile/mt5/${os}?server=Binary.com-Server` : href}
            download={download || undefined}
            target={target || undefined}
        >
            <span className={badge || undefined}>{badge ? '' : it.L(`Download MT5 for ${title}`)}</span>
        </a>
    </div>
);

const Download = () => (
    <div id='mt_download' className='static_full center-text'>
        <h1>{it.L('Start Trading with MetaTrader 5')}</h1>
        <h3>{it.L('Trade with a powerful interface known as the global industry standard.')}</h3>

        <div className='gr-padding-20'>
            <h1 className='invisible download-heading' id='windows-heading'>
                {it.L('MT5 for Windows')}
            </h1>
            <h1 className='invisible download-heading' id='macos-heading'>
                {it.L('MT5 for Mac')}
            </h1>
            <h1 className='invisible download-heading' id='linux-heading'>
                {it.L('MT5 for Linux')}
            </h1>
            <p>
                {it.L(
                    'Download MT5 for your desktop or laptop to access the powerful tools and features enjoyed by millions of traders.'
                )}
            </p>
            <div className='gr-row'>
                <DesktopDownloadBlock
                    id='windows'
                    title={it.L('Windows')}
                    image='windows'
                    href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe'
                />
                <DesktopDownloadBlock
                    id='macos'
                    title={it.L('MacOS')}
                    image='apple'
                    href='https://s3.amazonaws.com/binary-mt5/binary-mt5.dmg'
                    download='true'
                />
                <DesktopDownloadBlock
                    id='linux'
                    title={it.L('Linux')}
                    image='linux'
                    href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux'
                    target='_blank'
                />
            </div>
            <p className='alternative-download-description invisible' id='macos-alternative-description'>
                {it.L(
                    'Looking for [_1] or [_2] Desktop apps?',
                    `<a data-type='alt-link' data-target='windows' id='enable-windows-alt-link'>${it.L('Windows')}</a>`,
                    `<a data-type='alt-link' data-target='linux' id='enable-linux-alt-link'>${it.L('Linux')}</a>`
                )}
            </p>
            <p className='alternative-download-description invisible' id='windows-alternative-description'>
                {it.L(
                    'Looking for [_1] or [_2] Desktop apps?',
                    `<a data-type='alt-link' data-target='macos' id='enable-mac-alt-link'>${it.L('Mac')}</a>`,
                    `<a data-type='alt-link' data-target='linux' id='enable-linux-alt-link'>${it.L('Linux')}</a>`
                )}
            </p>
            <p className='alternative-download-description invisible' id='linux-alternative-description'>
                {it.L(
                    'Looking for [_1] or [_2] Desktop apps?',
                    `<a data-type='alt-link' data-target='windows' id='enable-windows-alt-link'>${it.L('Windows')}</a>`,
                    `<a data-type='alt-link' data-target='macos' id='enable-mac-alt-link'>${it.L('Mac')}</a>`
                )}
            </p>
            <p className='foot-note'>
                {it.L(
                    'The MetaTrader platform will no longer support Windows XP, Windows 2003, and Windows Vista after 01 October, 2017.'
                )}
            </p>
        </div>

        <SeparatorLine no_wrapper />

        <div className='gr-padding-20'>
            <h3>{it.L('For Mobile')}</h3>
            <p>{it.L('Access the markets anytime, anywhere using native apps for your iOS or Android devices.')}</p>
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
            <h3>{it.L('MT5 for web platform')}</h3>
            <p className='no-margin'>
                {it.L(
                    'Use the web platform from any Windows, MacOS, or Linux operating system – no download or installation required.'
                )}
            </p>
            <p className='no-margin'>{it.L('We support and prefer to use the below browser platforms')}</p>
            <div className='gr-row'>
                <div className='gr-8 gr-push-2 gr-8-p gr-push-2-p gr-12-m gr-push-0-m gr-padding-10 gr-parent'>
                    <div className='gr-row browsers'>
                        {['chrome', 'safari', 'firefox', 'edge', 'opera'].map((browser, idx) => (
                            <img
                                key={idx}
                                className='gr-centered'
                                src={it.url_for(`images/pages/metatrader/icons/${browser}.svg`)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='center-text'>
                <a
                    className='button'
                    href='https://trade.mql5.com/trade?servers=Binary.com-Server&amp;trade_server=Binary.com-Server'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <span>{it.L('Start trading MT5 on web platform')}</span>
                </a>
            </div>
        </div>
    </div>
);

export default Download;
