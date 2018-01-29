import React from 'react';
import Loading from '../_common/components/loading.jsx';
import Title from '../_common/components/title.jsx';
import AntiClickjack from '../_common/includes/anti_clickjack.jsx';
import Favicons from '../_common/includes/favicons.jsx';
import Gtm from '../_common/includes/gtm.jsx';

const Ico = () => {
    const items = [
        { id: 'days',    text: it.L('Days') },
        { id: 'hours',   text: it.L('Hours') },
        { id: 'minutes', text: it.L('Minutes') },
        { id: 'seconds', text: it.L('Seconds') },
    ];

    // news order: latest to oldest
    const news = [
        { logo: 'chipin',                 timestamp: 'Nov 24, 2017',    headlines: 'Meet the Boss – Exclusive Interview with Binary.com CEO Jean-Yves Sireau',                 url: 'https://www.chipin.com/binary-ceo-jean-yves-sireau-interview/' },
        { logo: 'cryptoreader',           timestamp: 'Nov 22, 2017',    headlines: 'Binary.com launches world’s first ICO with 18 years of history',                           url: 'https://cryptoreader.com/press_release/binary-com-launches-worlds-first-ico-18-years-history/' },
        { logo: 'coinspeaker',            timestamp: 'Nov 21, 2017',    headlines: 'Binary.com Aims to Disrupt Traditional Stock Exchanges with an “IPO on the Blockchain”',   url: 'https://www.coinspeaker.com/2017/11/10/binary-com-aims-disrupt-traditional-stock-exchanges-ipo-blockchain/' },
        { logo: 'ico-panic',              timestamp: 'Nov 21, 2017',    headlines: 'BINARY.COM OPTIONS TRADING TO LAUNCH ICO IN Q4 2017',                                      url: 'https://icopanic.com/binary-com-options-trading-to-launch-ico-in-q4-2017/' },
        { logo: 'the-merkle',             timestamp: 'Nov 19, 2017',    headlines: 'Binary.com Launches World’s First ICO with 18 Years of History',                           url: 'https://themerkle.com/binary-com-launches-worlds-first-ico-with-18-years-of-history/' },
        { logo: 'bitcoin-com',            timestamp: 'Nov 18, 2017',    headlines: 'PR: Binary.com Options Trading to Launch Initial Coin Offering (ICO) in q4 2017',          url: 'https://news.bitcoin.com/pr-binary-com-options-trading-announces-initial-coin-offering/' },
        { logo: 'ituber',                 timestamp: 'Nov 17, 2017',    headlines: 'Зачем компании с оборотом в миллиард долларов ICO?',                                       url: 'https://ituber.me/zachem-kompanii-s-oborotom-v-milliard-dollarov-ico/' },
        { logo: 'enews',                  timestamp: 'Nov 17, 2017',    headlines: 'Binary.com lanza su ICO',                                                                  url: 'http://emprendedoresnews.com/criptomonedas/binary-com-lanza-ico.html' },
        { logo: 'portal-do-branco',       timestamp: 'Nov 14, 2017',    headlines: 'ICO da Binary.com Começará em Poucas Horas',                                               url: 'https://portaldobitcoin.com/ico-da-binary-com-comecara-em-poucas-horas/' },
        { logo: 'cripto',                 timestamp: 'Nov 14, 2017',    headlines: 'Binary.com: anuncia o lançamento da sua oferta inicial de moedas (ICO) em novembro',       url: 'https://www.criptomoedasfacil.com/binary-com-anuncia-o-lancamento-da-sua-oferta-inicial-de-moedas-ico-em-novembro/' },
        { logo: 'coinstaker',             timestamp: 'Nov 13, 2017',    headlines: 'ICO: Binary.com – the Initial Coin Offering',                                              url: 'https://www.coinstaker.com/binary.com-ico' },
        { logo: 'hype-codes',             timestamp: 'Nov 12, 2017',    headlines: 'Top upcoming ICO 12th - 18th November (with voting)',                                      url: 'https://hype.codes/top-upcoming-ico-12th-18th-november-voting' },
        { logo: 'portal-do-branco',       timestamp: 'Nov 12, 2017',    headlines: 'A Binary.com anuncia lançamento de uma Oferta Inicial de Moedas (OIM)',                    url: 'https://portaldobitcoin.com/binary-com-anuncia-lancamento-de-uma-oferta-inicial-de-moedas-oim/' },
        { logo: 'coinist',                timestamp: 'Nov 12, 2017',    headlines: 'Binary Options & An ICO That Gives The House Advantage',                                   url: 'https://www.coinist.io/binary-ico-that-gives-you-the-house-advantage/' },
        { logo: 'coinist',                timestamp: 'Nov 10, 2017',    headlines: 'Binary.com spearheads a new wave of ICOs with its \'IPO on the blockchain\'',              url: 'https://www.coinist.io/binary-com-and-its-ipo-on-the-blockchain/' },
        { logo: 'ico1',                   timestamp: 'Nov 08, 2017',    headlines: 'BINARY.COM 宣布开展ICO',                                                                    url: 'http://www.ico1.com/a/jiangkaishi/1277.html' },
        { logo: 'binguru',                timestamp: 'Nov 08, 2017',    headlines: 'Binary выходит на ICO: памятка инвестору',                                                 url: 'https://binguru.net/binary-vyxodit-na-ico-pamyatka-investoru-5371' },
        { logo: 'coinist',                timestamp: 'Nov 08, 2017',    headlines: 'Binary.com’s Explosive Growth & Their Upcoming ICO',                                       url: 'https://www.coinist.io/binary-com-explosive-growth-ico/' },
        { logo: 'chipin',                 timestamp: 'Nov 08, 2017',    headlines: 'Introducing the Binary ICO – Redefining the Future of IPOs',                               url: 'https://www.chipin.com/binary-ico-redefining-future-ipos/' },
        { logo: 'cryptogo',               timestamp: 'Nov 07, 2017',    headlines: 'ICO Analyse - Binary.com',                                                                 url: 'https://cryptogo.de/binary-analyse/' },
        { logo: 'hype-codes',             timestamp: 'Nov 03, 2017',    headlines: 'The future of IPOs is blockchain',                                                         url: 'https://hype.codes/future-ipos-blockchain' },
        { logo: 'crypto-martez',          timestamp: 'Oct 27, 2017',    headlines: 'PR: Binary.com Announces Initial Coin Offering (ICO)',                                     url: 'https://www.cryptomartez.com/2017/10/pr-binary-com-announces-ico.html' },
        { logo: 'bittox',                 timestamp: 'Oct 25, 2017',    headlines: 'BINARY.COM ANNOUNCES INITIAL COIN OFFERING (ICO)',                                         url: 'https://bittox.com/2017/10/25/binary-com-announces-initial-coin-offering-ico/' },
        { logo: 'profit-f',               timestamp: 'Oct 23, 2017',    headlines: 'BINARY.COM offers securities-backed tokens in ICO',                                        url: 'http://www.profitf.com/news/binary-com-offers-securities-backed-tokens-initial-coin-offering-ico/' },
        { logo: 'profit-f',               timestamp: 'Oct 23, 2017',    headlines: 'Interview with Jean-Yves Sireau (CEO of Binary.com)',                                      url: 'http://www.profitf.com/interviews/interview-jean-yves-sireau-ceo-binary-com/#History_and_background' },
        { logo: 'leap-rate',              timestamp: 'Oct 23, 2017',    headlines: 'The Funding Benefits of the ICO (Initial Coin Offering)',                                  url: 'https://www.leaprate.com/experts/jean-yves-sireau/funding-benefits-ico-initial-coin-offering/' },
        { logo: 'finance-magnates',       timestamp: 'Oct 17, 2017',    headlines: 'Binary.com ‘Blockchain IPO’ Tokens to List on Lykke Vanuatu Exchange',                     url: 'https://www.financemagnates.com/cryptocurrency/exchange/binary-com-blockchain-ipo-tokens-list-lykke-vanuatu-exchange/' },
        { logo: 'btc-manager',            timestamp: 'Oct 17, 2017',    headlines: 'Binary.com Announces Initial Coin Offering (ICO)',                                         url: 'https://btcmanager.com/binary-com-announces-initial-coin-offering/' },
        { logo: 'coin-idol',              timestamp: 'Oct 17, 2017',    headlines: 'Online Trading Pioneer, Binary.com chooses ICO over IPO',                                  url: 'https://coinidol.com/online-trading-pioneer-binary-com-chooses-ico/' },
        { logo: 'coin-idol',              timestamp: 'Oct 16, 2017',    headlines: 'Binary.Com Announces Initial Coin Offering (ICO)',                                         url: 'https://coinidol.com/binary-com-ico/' },
        { logo: 'bitcoins-channel-news',  timestamp: 'Oct 10, 2017',    headlines: 'Binary.com Announces Initial Coin Offering (ICO)',                                         url: 'http://bitcoinschannel.com/binary-com-announces-initial-coin-offering-ico' },
        { logo: 'blockchain-news',        timestamp: 'Oct 6, 2017',     headlines: 'Binary.com Announces Initial Coin Offering (ICO)',                                         url: 'http://www.the-blockchain.com/2017/10/06/binary-com-announces-initial-coin-offering-ico/' },
        { logo: 'leap-rate',              timestamp: 'Sept 20, 2017',   headlines: 'Binary.com ICO provides a peek into the workings and finances of a Binary Options broker', url: 'https://www.leaprate.com/binary-options/broker/binary-com-ico-finances-binary-options-broker/' },
        { logo: 'finance-magnates',       timestamp: 'Sept 15, 2017',   headlines: 'Exclusive: Binary.com ICO Info Shows Profits to Surpass $20m in 2017',                     url: 'https://www.financemagnates.com/binary-options/brokers/exclusive-binary-com-ico-shows-company-profits-surpass-20-mln-2017/' },
        { logo: 'finance-magnates',       timestamp: 'Sept 13, 2017',   headlines: 'Exclusive: Binary.com Preparing an ICO, Looking for Blockchain Talent',                    url: 'https://www.financemagnates.com/cryptocurrency/news/exclusive-binary-com-preparing-ico-looking-blockchain-talent/' },
    ];

    return (
        <html>
            <head>
                <AntiClickjack />
                <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
                <meta httpEquiv='Content-Language' content={it.language} />
                <meta name='description' content={` ${it.L('[_1] ICO, Invest in the world\'s premier platform for binary options trading', it.broker_name)}`} />
                <meta name='keywords' content={` ${it.L('binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading')}`} />
                <meta name='author' content={it.broker_name} />
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
                <meta name='dcterms.rightsHolder' content={it.broker_name} />
                <meta name='dcterms.rights' content={it.broker_name} />
                <meta property='og:title' content={it.broker_name} />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />

                <Title />

                <Favicons />

                <link href={`${it.url_for('css/ico.css')}?${it.static_hash}`} rel='stylesheet' />
                <link href={`https://style.binary.com/binary.css?${it.static_hash}`} rel='stylesheet' />
                <link href='https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.2.4/tiny-slider.css' rel='stylesheet' />
            </head>

            <body>
            <Gtm />
            <div className='navbar-fixed-top' role='navigation' id='navigation'>
                <div className='navbar-header'>
                    <span id='toggle-menu' href='button' className='navbar-toggle'></span>
                    <a className='navbar-brand logo' href={it.url_for('home')}></a>
                </div>
                <div className='navbar-collapse'>
                    <ul className='nav navbar-nav invisible'>
                        <li className='invisible'>
                            <a href='#page-top'></a>
                        </li>
                        <li>
                            <a href={it.url_for('ico-disclaimer')}>{it.L('Information Memorandum')}</a>
                        </li>
                        <li>
                            <a className='page-scroll' href='#how-ico-works'>{it.L('How the ICO works')}</a>
                        </li>
                        <li>
                            <a className='page-scroll' href='#who-we-are'>{it.L('Who we are')}</a>
                        </li>
                        <li>
                            <a className='page-scroll' href='#our-growth'>{it.L('Our growth')}</a>
                        </li>
                        <li>
                            <a className='faq-btn' href='#faq'>{it.L('FAQ')}</a>
                        </li>
                        <li id='language'>
                            <ul className='language-dropdown invisible'>
                                <a id='lang' className='selected' href='javascript:;'>
                                    <span className='world'></span>
                                    <span id='selected-lang'></span>
                                    <span className='nav-caret'></span>
                                </a>
                                <li className='en'>English</li>
                                <li className='de'>Deutsch</li>
                                {/* <li className='es'>Español</li>*/}
                                <li className='fr'>Français</li>
                                <li className='id'>Indonesia</li>
                                {/* <li className='it'>Italiano</li>*/}
                                {/* <li className='ja'>日本語</li>*/}
                                <li className='pl'>Polish</li>
                                <li className='pt'>Português</li>
                                <li className='ru'>Русский</li>
                                <li className='th'>Thai</li>
                                <li className='vi'>Tiếng Việt</li>
                                <li className='zh_cn'>简体中文</li>
                                <li className='zh_tw'>繁體中文</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div id='home' className='overflow-x-hidden'>
                {/* Intro Header*/}
                <div id='page-top' className='intro'>
                    <div className='intro-body'>
                        <div className='container center-text content-inverse-color'>
                            <div className='gr-row'>
                                <div className='gr-12'>
                                    <h1 className='brand-heading'>{it.L('[_1] ICO', it.broker_name)}</h1>
                                    <p className='intro-text'>{it.L('Invest in the world\'s premier platform for binary options trading')}</p>
                                    <p className='intro-subtext'>{it.L('An Initial Coin Offering (or \'ICO\' for short) is a fundraising method that\'s relatively similar to an IPO. In an ICO, cryptocurrency tokens are issued instead of shares.')}</p>
                                </div>
                            </div>
                        </div>
                        <div id='coming-soon' className='content-section center-text transparent-dark-blue-bg'>
                            <div className='gr-row'>
                                <div id='status_loading'>
                                    <Loading theme='white' />
                                </div>
                                <div id='status_container' className='gr-12 invisible'>
                                    <div className='status-toggle status-started'>
                                        <h2 className='content-inverse-color text-uppercase'>{it.L('ICO is live, participate now!')}</h2>
                                        <p className='intro-text'>{it.L('Token sale ends in')}</p>
                                    </div>
                                    <div className='status-toggle status-ended'>
                                        <h3 className='content-inverse-color'>{it.L('The [_1] token sale has ended', it.broker_name)}</h3>
                                    </div>
                                    <div className='status-toggle status-started' id='countdown'>
                                        { items.map((item, idx) => (
                                            <span key={idx} className='cd-item' id={`cd_${item.id}`}>
                                                    <span className='arcs'>
                                                        <span className='arc_q'></span>
                                                        <span className='arc_q'></span>
                                                        <span className='arc_q'></span>
                                                        <span className='arc_q'></span>
                                                        <span className='arc_cover'></span>
                                                    </span>
                                                    <span className='cd-value'></span>
                                                    <span className='cd-label'>{item.text}</span>
                                                </span>
                                        ))}
                                    </div>
                                    <div id='sign-up-section' className='invisible'>
                                        <div className='signup-desc invisible'>
                                            <p>{it.L('Investors need to open a [_1] real money account to take part in the ICO.', it.broker_name)}</p>
                                            <p>{it.L('Sign up now for free.')}</p>
                                        </div>
                                        <div className='signup-container gr-9 gr-12-p gr-12-m gr-centered invisible'>
                                            <form id='frm_verify_email'>
                                                <div className='gr-row gr-row-align-center'>
                                                    <div className='signup-box gr-8 gr-10-p gr-12-m gr-no-gutter secondary-bg-color'>
                                                        <div className='gr-row gr-padding-10' id='signup'>
                                                            <div className='gr-7 gr-7-p gr-12-m gr-centered'>
                                                                <input autoComplete='off' name='email' id='email' maxLength='50' placeholder={it.L('Enter your email')} />
                                                                <div id='error_validate_email' className='invisible error-msg'>{it.L('Invalid email address.')}</div>
                                                                <div id='error_no_email' className='invisible error-msg'>{it.L('This field is required.')}</div>
                                                            </div>
                                                            <div className='gr-5 gr-5-p gr-12-m gr-centered'>
                                                                <button className='primary-bg-color' id='btn_verify_email' type='submit'>{it.L('Create Free Account')}</button>
                                                            </div>
                                                            <span className='gr-12 gr-padding-10 error-msg hint color-white center-text invisible' id='signup_error'></span>
                                                        </div>
                                                        <div className='invisible' id='success'>
                                                            <div className='gr-padding-10 center-text hint gr-12 align-self-center'>
                                                                <p>{it.L('Thank you for signing up! Please check your email to complete the registration process.')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className='status-toggle status-started ico-subscribe-btn'>
                                        <div id='account_exists_message' className='center-text gr-12 align-self-center invisible'>
                                            <p>{it.L('Already have an account?')}</p>
                                        </div>
                                        <a className='button' href={it.url_for('user/ico-subscribe')}><span>{it.L('Participate now')}</span></a>
                                    </div>
                                    <div className='status-toggle status-ended ico-subscribe-btn'>
                                        <a className='button' href={it.url_for('user/ico-subscribe')}><span>{it.L('Take me there')}</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* How ICO Works section*/}
                <div id='how-ico-works' className='container content-section center-text'>
                    <div className='gr-row'>
                        <div className='gr-8 gr-push-2 gr-push-0-m gr-12-m'>
                            <h2>{it.L('How does the ICO work')}</h2>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4 gr-12-m vertical-center'>
                            <div className='box'>
                                <img className='icon' src={it.url_for('images/ico/icons/coins_icon.svg')} />
                                <h4>{it.L('Purchase our tokens')}</h4>
                                <p>{it.L('[_1] will issue a number of tokens during the ICO.', it.broker_name)}</p>
                            </div>
                            <img className='arrow' src={it.url_for('images/ico/icons/arrow1.svg')} />
                        </div>
                        <div className='gr-4 gr-12-m vertical-center'>
                            <div className='box'>
                                <img className='icon' src={it.url_for('images/ico/icons/ch_icon.svg')} />
                                <h4>{it.L('Earn exclusive tokenholder rights')}</h4>
                                <p>{it.L('Each token provides you with two exclusive tokenholder rights.')}</p>
                            </div>
                            <img className='arrow' src={it.url_for('images/ico/icons/arrow2.svg')} />
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <div className='gr-row'>
                                <div className='gr-12'>
                                    <div className='box'>
                                        <img className='icon' src={it.url_for('images/ico/icons/dp_icon.svg')} />
                                        <h4>{it.L('Receive dividend payments')}</h4>
                                        <p>{it.L('As a tokenholder, you have the right to receive payments equivalent to shareholder dividends.')}</p>
                                    </div>
                                </div>
                                <div className='gr-12'>
                                    <div className='box'>
                                        <img className='icon' src={it.url_for('images/ico/icons/ccs_icon.svg')} />
                                        <h4>{it.L('Convert your tokens into shares')}</h4>
                                        <p>{it.L('As a tokenholder, you also have the right to convert your tokens into Ordinary Shares.')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className='gr-12'>
                            <a className='button howto-btn' href='javascript:;'>
                                <span>{it.L('How to participate in the [_1] ICO', it.broker_name)}</span>
                            </a>
                        </p>
                    </div>
                </div>

                <div id='lykke-section' className='content-section-sm center-text fill-bg-color'>
                    <div className='container'>
                        <div className='gr-row'>
                            <div className='gr-10 gr-push-1'>
                                <h2>{it.L('Trade your tokens on the Lykke Exchange')}</h2>
                                <img src={it.url_for('images/ico/icons/lykke_logo.svg')} />
                                <p>{it.L('We\'ve reached an agreement to list the tokens on the <a href="[_1]" target="_blank" rel="noreferrer noopener">Lykke Exchange</a>.', 'https://www.lykke.com/')}</p>
                                <a className='button' href='https://www.lykke.com/company/news/binary' target='_blank' rel='noreferrer noopener'>
                                    <span>{it.L('Read the official press release')}</span>
                                </a>
                                <p>{it.L('As featured in [_1]', '<a href="https://www.financemagnates.com/cryptocurrency/exchange/binary-com-blockchain-ipo-tokens-list-lykke-vanuatu-exchange/" target="_blank" rel="noreferrer noopener">Finance Magnates</a>')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container content-section center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('Token dividends')}</h2>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/is_icon.svg')} />
                            <h4>{it.L('How often do you issue dividends?')}</h4>
                            <p>{it.L('Binary generally distributes dividends once a year, at the sole discretion of its board.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/ich_icon.svg')} />
                            <h4>{it.L('How do you inform tokenholders?')}</h4>
                            <p>{it.L('Distribution of dividends will be announced on the [_1] website.', it.broker_name)}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/dvnd_icon.svg')} />
                            <h4>{it.L('How much dividend will I receive?')}</h4>
                            <p>{it.L('Tokens entitle you to an equivalent amount of dividends as Binary Ordinary Shares.')}</p>
                        </div>
                    </div>
                </div>

                <div id='read-im-section' className='content-section primary-bg-color center-text'>
                    <div className='gr-row'>
                        <div className='gr-6 gr-push-3 gr-12-m gr-push-0-m'>
                            <h2 className='content-inverse-color'>{it.L('Read the Information Memorandum for further information about the proposed offer.')}</h2>
                            <button data-url={it.url_for('ico-disclaimer')} id='view_memorandum' className='button'>{it.L('View memorandum')}</button>
                        </div>
                    </div>
                </div>

                <div id='faq-section' className='content-section fill-bg-color center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('Need more information on the ICO?')}</h2>
                        </div>
                        <div className='gr-12'>
                            <a href='#faq' className='button faq-btn'>
                                <span>{it.L('Read our FAQ')}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div id='reports-section' className='center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('Independent analysis')}</h2>
                        </div>
                        <div className='gr-6 gr-push-3 gr-12-m gr-push-0-m'>
                            <p>{it.L('Need a different perspective? Read these independent third-party reports for unbiased insights and opinions on Binary.com and our token offering.')}</p>
                        </div>
                    </div>
                    <div className='gr-row content-section-sm'>
                        <div className='gr-4 gr-12-p gr-12-m lykke-mask'>
                            <div className='gr-row'>
                                <div className='gr-8 gr-push-2 gr-10-m gr-push-1-m gr-12-p gr-push-0-p'>
                                    <h4>Lykke</h4>
                                    <p>{it.L('This equity research report by Lykke Accelerator gives you an overview of our company structure, financial performance, forecasts of future revenue, and more.')}</p>
                                    <a id='lykke-btn' href='javascript:;' target='_blank' rel='noopener noreferrer' className='button'>
                                        <span>{it.L('View Lykke report')}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='gr-4 gr-12-p gr-12-m token-mask'>
                            <div className='gr-row'>
                                <div className='gr-8 gr-push-2 gr-10-m gr-push-1-m gr-12-p gr-push-0-p'>
                                    <h4>TokenRating</h4>
                                    <p>{it.L('This research report by India-based TokenRating analyses the structure of our token offering and the potential impact of our convertible tokens with dividend rights.')}</p>
                                    <a id='token-btn' href='javascript:;' target='_blank' rel='noopener noreferrer' className='button'>
                                        <span>{it.L('View TokenRating report')}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='gr-4 gr-12-p gr-12-m nishant-mask'>
                            <div className='gr-row'>
                                <div className='gr-8 gr-push-2 gr-10-m gr-push-1-m gr-12-p gr-push-0-p'>
                                    <h4>Nishant Sah</h4>
                                    <p>{it.L('This value analysis by an experienced investor, Nishant Sah studies the risk, benefits, and valuations of our token offering based on our past and projected growth.')}</p>
                                    <a id='nishant-btn' href='javascript:;' target='_blank' rel='noopener noreferrer' className='button'>
                                        <span>{it.L('View Nishant\'s report')}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Who We Are section*/}
                <div id='who-we-are' className='content-section who-we-are-bg'>
                    <div className='gr-row center-text'>
                        <div className='gr-4'>
                            <h2 className='boxed-heading boxed-heading-center'>{it.L('Who is [_1]', it.broker_name)}</h2>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='gr-row'>
                            <div className='gr-4 gr-12-m'>
                                <div className='content-inverse-color gr-padding-30'>
                                    <div className='gr-row'>
                                        <p>{it.L('[_1] is the pioneer of online binary options trading. We grew from one simple idea: to make binary options easily accessible to retail investors worldwide.', it.broker_name)}</p>
                                        <p>{it.L('Today, we’ve established ourselves as a market leader and one of the most popular online binary options trading platforms in the world.')}</p>
                                        <p>{it.L('Our track record speaks for itself; we recorded a turnover of USD 847.6 million in 2016 &mdash;&mdash; bringing our total turnover to over USD 3 billion since we launched in 2000.')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='gr-7 gr-push-1 gr-push-0-m gr-12-m white-bg'>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Licensed and regulated')}</h4>
                                        <p>{it.L('[_1] is licensed and regulated in Malta, the British Isles, Japan, and Vanuatu.', it.broker_name)}</p>
                                    </div>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Extensive product range')}</h4>
                                        <p>{it.L('Over 100 asset classes across Forex, CFDs, and binary options.')}</p>
                                    </div>
                                </div>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Sharp prices')}</h4>
                                        <p>{it.L('Our cutting-edge pricing technology benchmarks our prices against interbank market rates wherever possible.')}</p>
                                    </div>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Patented technology')}</h4>
                                        <p>{it.L('[_1] developed the systems, methods, and algorithms that made binary options accessible to retail traders.', it.broker_name)}</p>
                                    </div>
                                </div>
                                <div className='gr-row'>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Award-winning platforms')}</h4>
                                        <p>{it.L('Trade anytime, anywhere with our desktop, web, and mobile platforms.')}</p>
                                    </div>
                                    <div className='gr-6 gr-12-m'>
                                        <h4>{it.L('Global presence')}</h4>
                                        <p>{it.L('[_1] employs over 130 people across its offices in Malta, Malaysia and Japan.', it.broker_name)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Our Growth section*/}
                <div id='our-growth' className='content-section center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('[_1] by the numbers', it.broker_name)}</h2>
                            <p className='section-intro'>{it.L('These key metrics will show you what growth and success looks like for an award-winning binary options trading platform.')}</p>
                        </div>
                    </div>
                    <div id='charts' className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-right'>{it.L('Dividends paid out')}</h5>
                                <img src={it.url_for('images/ico/images/dp_chart.svg')} />
                                <p>{it.L('A record-breaking year for turnover and profit in 2016 saw us distribute nearly USD 12 million in total dividend payments to shareholders.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-left'>{it.L('Gross and net profit')}</h5>
                                <img src={it.url_for('images/ico/images/gn_chart.svg')} />
                                <p>{it.L('[_1] is a successful and growing platform, with several ongoing initiatives to enhance future profitability. These include our entry into new regulated markets with significant growth potential, and the innovation and expansion of our product offerings.', it.broker_name)}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-right'>{it.L('Turnover')}</h5>
                                <img src={it.url_for('images/ico/images/to_chart.svg')} />
                                <p>{it.L('We’ve generated over USD 3 billion in turnover since inception, thanks to a rapid growth in business from 2010 onwards.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-left'>{it.L('Active clients')}</h5>
                                <img src={it.url_for('images/ico/images/nac_chart.svg')} />
                                <p>{it.L('Total active clients on our platform have almost doubled from 2014 to 2016. This is largely due to our focus on improving customer retention and acquiring new customers via targeted online marketing campaigns.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-right'>{it.L('Client transactions')}</h5>
                                <img src={it.url_for('images/ico/images/ntb_chart.svg')} />
                                <p>{it.L('In the last two years alone, over 276 million contracts were bought and sold on our platform.')}</p>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <div className='chart'>
                                <h5 className='chart-heading chart-heading-left'>{it.L('Employees and Contractors')}</h5>
                                <img src={it.url_for('images/ico/images/nec_chart.svg')} />
                                <p>{it.L('We’ve grown in size over the years &mdash;&mdash; both in terms of manpower and offices. We currently have over 130 employees across four offices in three countries: Malaysia, Malta and Japan.')}</p>
                            </div>
                        </div>
                        <div className='vertical-line'></div>
                        <p className='chart-note'>{it.L('Note: 2017 numbers are projected from August interim figures')}</p>
                    </div>
                </div>
                <div id='acquired-section' className='content-section center-text acquired-bg'>
                    <div className='container'>
                        <div className='gr-row'>
                            <div className='gr-6 gr-push-3 gr-12-m gr-push-0-m'>
                                <h2 className='content-inverse-color'>{it.L('Binary Group Ltd. acquired 100% of Binary Ltd. in August 2017 for the purposes of the ICO.')}</h2>
                                <a className='button' href='https://ico_documents.binary.com/binary_ltd_2016_annual_report.pdf' target='_blank' rel='noopener noreferrer'>
                                    <span>{it.L('View Binary Ltd.\'s 2016 annual report')}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='board-of-directors' className='content-section'>
                    <div className='gr-row center-text'>
                        <div className='gr-4'>
                            <h2 className='boxed-heading-center'>{it.L('Board of directors')}</h2>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='gr-row'>
                            <div className='gr-4 gr-12-m'>
                                <div className='center-text'>
                                    <img className='responsive' src={it.url_for('images/ico/images/jy@2x.png')} />
                                    <h4>Jean-Yves Sireau</h4>
                                    <a href='https://www.linkedin.com/in/jeanyvessireau/' target='_blank' rel='noopener noreferrer'>
                                        <img className='icon--sm' src={it.url_for('images/ico/icons/linkedin.svg')} />
                                    </a>
                                    <a href='https://twitter.com/jysireau' target='_blank' rel='noopener noreferrer'>
                                        <img className='icon--sm' src={it.url_for('images/ico/icons/twitter.svg')} />
                                    </a>
                                </div>
                                <p>{it.L('Jean-Yves Sireau is the founder of the Company. A serial entrepreneur at heart, he founded his first company in 1991. His achievements at only 21 years old saw him awarded the prestigious Foundation Jacques Dounce prize for young entrepreneurs by the French prime minister Edith Cresson, and the Neuilly Professions prize by a future French president Nicolas Sarkozy. Jean-Yves founded Fortitude Fund Management, a hedge fund management group, in 1993, and [_1] (formerly known as Betonmarkets.com) in 1999.', it.broker_name)}</p>
                            </div>
                            <div className='gr-4 gr-12-m'>
                                <div className='center-text'>
                                    <img className='responsive' src={it.url_for('images/ico/images/joanna@2x.png')} />
                                    <h4>Joanna Frendo</h4>
                                    <a href='https://www.linkedin.com/in/joanna-frendo-prof-pgdip-fcc-4449975/' target='_blank' rel='noopener noreferrer'>
                                        <img className='icon--sm' src={it.url_for('images/ico/icons/linkedin.svg')} />
                                    </a>
                                </div>
                                <p>{it.L('Joanna oversees the Group\'s procedural and regulatory compliance with the various licensing compliance jurisdictions of the [_1] Group, in addition to overseeing a number of the Group\'s key operational areas such as payments and client account management. Joanna has been a member of the Malta Institute of Management since 1999, holds a diploma in Financial Services Operations and Compliance, and a Professional Post-Graduate Diploma in Financial Crime Compliance with the International Compliance Association.', it.broker_name)}</p>
                            </div>
                            <div className='gr-4 gr-12-m'>
                                <div className='center-text'>
                                    <img className='responsive' src={it.url_for('images/ico/images/jm@2x.png')} />
                                    <h4>Jim Mellon</h4>
                                    <a href='https://twitter.com/jimmhk' target='_blank' rel='noopener noreferrer'>
                                        <img className='icon--sm' src={it.url_for('images/ico/icons/twitter.svg')} />
                                    </a>
                                    <a href='https://www.youtube.com/results?search_query=jim+mellon' target='_blank' rel='noopener noreferrer'>
                                        <img className='icon--sm' src={it.url_for('images/ico/icons/youtube.svg')} />
                                    </a>
                                </div>
                                <p>{it.L('Jim Mellon is a well-known and successful entrepreneur, starting his career in fund management and now including biopharma, property, mining, and information technology amongst his many investments. Jim is listed at number 140 on the Sunday Times Rich List with a net worth of &pound;920 million, and holds directorships in a number of publicly quoted companies. He is the founder and principal shareholder of the Regent Pacific Group, quoted on the Hong Kong Stock Exchange, who were the founding investor of Binary.com in 1999.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content-section blue-bg'>
                    <div className='gr-row content-inverse-color'>
                        <div className='gr-3 gr-push-2 gr-push-0-m gr-12-m'>
                            <hr className='highlight' />
                            <h2>{it.L('What are binary options')}</h2>
                            <p className='section-intro'>{it.L('Binary options possess unique attributes that appeal to both retail and institutional traders worldwide.')}</p>
                        </div>
                        <div className='gr-4 gr-push-3 gr-push-0-m gr-12-m'>
                            <h4 className='secondary-color'>{it.L('Limited risk')}</h4>
                            <p>{it.L('You can only lose your initial investment and nothing more.')}</p>
                            <h4 className='secondary-color'>{it.L('Low minimum collateral')}</h4>
                            <p>{it.L('Deposit as little as USD 5 and start trading from USD 5 per contract.')}</p>
                            <h4 className='secondary-color'>{it.L('Multiple trading opportunities')}</h4>
                            <p>{it.L('Trade short-term or long-term contracts, from 10 seconds to 365 days.')}</p>
                        </div>
                    </div>
                </div>
                <div className='container content-section center-text'>
                    <div className='gr-row'>
                        <div className='gr-8 gr-push-2 gr-push-0-m gr-12-m'>
                            <h2>{it.L('Market opportunities for binary options')}</h2>
                            <p>{it.L('The binary options industry is poised for breakout growth similar to the growth shown by the Forex industry &mdash;&mdash; thanks to key trends and events in emerging and developed markets.')}</p>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/ea_icon.svg')} />
                            <h4>{it.L('Exciting growth in Europe and Asia')}</h4>
                            <p>{it.L('Organic growth is driving demand, especially in the Far East – the world’s leading market for binary options.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/jp_icon.svg')} />
                            <h4>{it.L('New regulations in Japan')}</h4>
                            <p>{it.L('After a lengthy process, we were awarded a financial license to operate in the country, in compliance with its new regulations.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <img className='icon' src={it.url_for('images/ico/icons/eu_icon.svg')} />
                            <h4>{it.L('EU recognition')}</h4>
                            <p>{it.L('The European Commission recognised binary options as financial instruments in 2012, meaning increased credibility for licensed brokers.')}</p>
                        </div>
                    </div>
                </div>
                <hr />
                {/* Stay Informed section*/}
                <div id='stay-informed' className='container content-section center-text'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('Our strengths')}</h2>
                            <p className='section-intro'>{it.L('We possess a number of attributes which differentiate us from other players in the market.')}</p>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Intellectual property')}</h4>
                            <p>{it.L('Our platform is backed by proprietary technology, developed and managed by a highly-skilled and experienced team carefully handpicked from around the world.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Extensive product portfolio')}</h4>
                            <p>{it.L('We offer an innovative product range for customers consisting of financial and synthetic instruments with durations ranging from 10 seconds to 365 days.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Strategic licensing')}</h4>
                            <p>{it.L('We’ve obtained financial and gambling licenses to operate in key countries and regions such as Europe, the Isle of Man, the United Kingdom, and Japan.')}</p>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Scalable business model')}</h4>
                            <p>{it.L('We have the ability to adapt and scale to meet the demands of new clients, thanks to the teams and processes that we’ve put together over the years.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Strong leadership')}</h4>
                            <p>{it.L('We have an agile senior management team with more than 30 years of collective experience in the industry, as well as a succession plan in place.')}</p>
                        </div>
                        <div className='gr-4 gr-12-m'>
                            <h4>{it.L('Strategic customer acquisition strategy')}</h4>
                            <p>{it.L('We employ a wide range of unique marketing initiatives to acquire customers. We are focused primarily on untapped markets.')}</p>
                        </div>
                    </div>
                </div>

                <div id='media-coverage' className='fill-bg-color content-section-sm center-text'>
                    <div className='container'>
                        <div className='gr-row'>
                            <div className='gr-12'>
                                <h3>{it.L('Media coverage')}</h3>
                            </div>
                        </div>
                        <div className='slider-container invisible'>
                            <div className='my-slider'>
                                {news.map((media, idx) => (
                                    <div key={idx}>
                                        <a href={media.url} target='_blank' rel='noopener noreferrer'>
                                            <div className='media'>
                                                <span className={`media__logo ${media.logo}`}></span>
                                                <p className='media__headlines'>{media.headlines}</p>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p>{it.L('Join the conversation on our social channels for all news and updates related to our upcoming ICO.')}</p>
                        <div className='gr-row gr-row-align-center'>
                            <a href='https://t.me/binarydotcom' target='_blank' rel='noopener noreferrer' className='gr-gutter-right'>
                                <img className='responsive' src={it.url_for('images/ico/icons/telegram.svg')} />
                            </a>
                            <a href='https://www.reddit.com/r/binarydotcom/' target='_blank' rel='noopener noreferrer' className='gr-gutter-right'>
                                <img className='responsive' src={it.url_for('images/ico/icons/reddit.svg')} />
                            </a>
                            <a href='https://www.facebook.com/mybinarycoin' target='_blank' rel='noopener noreferrer' className='gr-gutter-right'>
                                <img className='responsive' src={it.url_for('images/ico/icons/facebook.svg')} />
                            </a>
                            <a href='https://bitcointalk.org/index.php?topic=2368998.0' target='_blank' rel='noopener noreferrer'>
                                <img className='responsive' src={it.url_for('images/ico/icons/bitcoin_talk.svg')} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div id='faq' className='invisible'>
                <div className='intro'>
                    <div className='center-text content-section intro-body'>
                        <div className='gr-row'>
                            <div className='gr-12'>
                                <h1 className='brand-heading'>{it.L('[_1] ICO FAQ', it.broker_name)}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container content-section'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <h2>{it.L('Frequently Asked Questions')}</h2>
                        </div>
                    </div>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What is an ICO?')}</h4>
                                <p>{it.L('An ‘Initial Coin Offering’ (or ‘ICO’) is a fundraising method that is relatively similar to an Initial Public Offering (IPO). However, in an ICO, cryptocurrency - such as ‘coloured coins’ or ‘Ethereum tokens’ - is issued to investors instead of shares.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Why is [_1] performing an ICO?', it.broker_name)}</h4>
                                <p>{it.L('[_1] was founded in 1999. Today, it is a well-established, and very successful, company. Like many successful companies, the growth of our business led us to consider an IPO.', it.broker_name)}</p>
                                <p>{it.L('However, we believe that in the coming decade traditional stock exchanges will gradually be replaced by blockchain exchanges, and IPOs will gradually be replaced by ICOs. This is because blockchain technologies are much more performant than the legacy technologies of traditional stock exchanges, leading to lower transaction fees, faster settlement times, and error-free immutable audit trails. Hence, we decided to perform an ICO instead of an IPO.')}</p>
                                <p>{it.L('For further background information please read our blog post, <a href=\'[_1]\' target=\'_blank\' rel=\'noopener noreferrer\'>Why we are doing an ICO (and not an IPO)</a>.', 'https://blog.binary.com/ipo-or-ico/')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How does the ICO work?')}</h4>
                                <p>{it.L('[_1] will offer a number of blockchain tokens to investors. These tokens will be ‘ERC20’ tokens on the Ethereum blockchain, however the Company may issue tokens on other blockchains if there is sufficient investor demand for different token types.', it.broker_name)}</p>
                                <p>{it.L('Regardless of the type of token issued, each token will provide investors with two rights:')}</p>
                                <ol>
                                    <li>{it.L('The right to receive payments equivalent to dividends paid on Binary Group Ltd. Ordinary Shares; and')}</li>
                                    <li>{it.L('The right to convert tokens into Ordinary Shares.')}</li>
                                </ol>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Why are the tokens convertible into shares, rather than representing shares directly?')}</h4>
                                <p>{it.L('Corporate laws in most jurisdictions (including the British Virgin Islands, where our Group company is incorporated) do not yet support blockchain-based share registers.')}</p>
                                <p>{it.L('Therefore, the tokens are issued as derivative securities, convertible into Ordinary Shares.')}</p>
                                <p>{it.L('The tokens entitle the holder to receive dividend-linked payments, and carry economic benefits that are equivalent to Ordinary Shares. Thus, there would ordinarily be no practical reason for token holders to convert their tokens to shares.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('When will the tokens be offered?')}</h4>
                                <p>{it.L('The tokens will be offered from 15 November 2017 to 25 December 2017.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How are the tokens offered?')}</h4>
                                <p>{it.L('The tokens are offered via an auction process. To place a bid, you just need to deposit 5% of the total bid price upfront. After the auction is over and the final price is determined, you will have two weeks to deposit the balance payable depending on the final token price.')}</p>
                                <p>{it.L('This means that you won’t have to tie up important funds in order to keep your bids active.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Do I need to pay a penalty for cancelling a bid?')}</h4>
                                <p>{it.L('Not at all. You can cancel a bid at any time before the auction ends at no cost.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How many tokens are available?')}</h4>
                                <p>{it.L('Up to 10 million tokens are available via the auction.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What is the minimum bid price?')}</h4>
                                <p>{it.L('The minimum bid is USD 1.35/token or equivalent in other currency/cryptocurrency.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How high should I bid?')}</h4>
                                <p>{it.L('The higher you bid, the more your chances of being successful in the auction. However irrespective of how high you bid, at the end of the auction all winning bids will receive the same final price, which is the lowest winning bid.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Who can purchase the tokens?')}</h4>
                                <p>{it.L('Tokens will only be offered to [_1] clients who have a Real Money account. Please visit [_2]www.binary.com[_3] to open an account.', it.broker_name, `<a href=${it.url_for('home')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Is the ICO available in all jurisdictions?')}</h4>
                                <p>{it.L('The ICO will be restricted in a number of jurisdictions to qualified or professional investors, in accordance with the rules and regulations of such jurisdictions. In particular, the ICO is not available to US investors.')}</p>
                                <p>{it.L('To find out if the ICO is available in your jurisdiction, and, if so, if you are qualified to subscribe for tokens, please select your country from the dropdown list on the [_1]Information Memorandum[_2] page.', `<a href=${it.url_for('ico-disclaimer')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How can I purchase tokens?')}</h4>
                                <p>{it.L('You will be able to purchase tokens using the funds in your [_1] account. You may use any of the available currencies (including cryptocurrencies) in our [_2]cashier system[_3]. If you choose to bid in a currency other than USD, the bid amount shall be converted to USD at the prevailing exchange rate at the time the auction ends.', it.broker_name, `<a href=${it.url_for('cashier/payment_methods')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Where will the tokens be listed?')}</h4>
                                <p>{it.L('[_1] has entered into an agreement to list the tokens on the [_2]Lykke.com[_3] cryptocurrency exchange. Lykke is a Swiss fintech company building a global blockchain-powered marketplace for securities-linked tokens.', it.broker_name, '<a href="https://www.lykke.com" target="_blank" rel="noopener noreferrer">', '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What will be the token symbol?')}</h4>
                                <p>{it.L('We intend to apply for the token symbol BINARY.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What are the benefits of purchasing tokens?')}</h4>
                                <p>{it.L('There will be three main benefits of purchasing tokens.')}</p>
                                <p>{it.L('First, token holders will receive dividend-linked payments equivalent to the dividends paid by the Company on its Ordinary Shares. Therefore, token holders will share in the future success of the Company in the same way as do shareholders.')}</p>
                                <p>{it.L('Second, tokens may be converted into Ordinary Shares of the Company (subject to certain conditions, as described in the Information Memorandum), thereby providing the legal link between tokens and Ordinary Shares.')}</p>
                                <p>{it.L('Third, token holders will be able to freely trade their tokens. In contrast, Ordinary Shares are not listed and therefore cannot be traded on any exchange. In that sense, the tokens will be a superior investment to Ordinary Shares.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Where can I view the source code of the tokens?')}</h4>
                                <p>{it.L('Binary.com intends to deploy the <a href=\'[_1]\' target=\'_blank\' rel=\'noopener noreferrer\'>Mini Me</a> token. Please view our <a href=\'[_2]\' target=\'_blank\' rel=\'noopener noreferrer\'>blog post</a> detailing our reasons for choosing this token.', 'https://github.com/Giveth/minime', 'https://tech.binary.com/an-erc20-securities-token/')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What are the risks of purchasing tokens?')}</h4>
                                <p>{it.L('Although [_1] has been a successful company since its inception in 1999, the tokens should be considered a high risk investment. The [_1] business is subject to a number of risks which could adversely affect the company and hence affect the future value of the tokens. These risks are detailed in the [_2]Information Memorandum[_3] and should be considered very carefully before proceeding with any investment in the tokens.', it.broker_name, `<a href=${it.url_for('ico-disclaimer')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How can I find out more about [_1]?', it.broker_name)}</h4>
                                <p>{it.L('To find out more about [_1], you can read about our [_2]group history[_3], [_4]regulatory status[_3], and [_5]company culture[_3]. You can also read the [_6]company blog[_3].', it.broker_name, `<a href=${it.url_for('group-history')} target='_blank' rel='noopener noreferrer'>`, '</a>', `<a href=${it.url_for('regulation')} target='_blank' rel='noopener noreferrer'>`, `<a href=${it.url_for('careers')} target='_blank' rel='noopener noreferrer'>`, '<a href="https://blog.binary.com/" target="_blank" rel="noopener noreferrer">')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How can I learn more about ICOs and cryptocurrencies?')}</h4>
                                <p>{it.L('Head over to our <a href=[_1] target=\'_blank\'  rel=\'noopener noreferrer\'>YouTube</a> channel to learn more about ICOs, popular cryptocurrencies, and blockchain technology. We’ll show you how they work and how they are changing the way we do business.', 'https://www.youtube.com/user/BinaryTradingVideos')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How will you issue dividends to tokenholders?')}</h4>
                                <p>{it.L('We are adopting the ‘Mini Me’ ERC20 token for our ICO. This type of token possesses unique features that are suited to securities tokens. One of its unique features is the ability to clone itself, thus creating a mini version of itself.')}</p>
                                <p>{it.L('To implement our dividend payments feature, we will clone our tokens and each cloned token will represent dividend rights.')}</p>
                                <p>{it.L('At this stage, tokenholders can cash out their dividends in one of two ways:')}</p>
                                <ul className='bullet'>
                                    <li>{it.L('Trade your cloned tokens on a cryptocurrency exchange')}</li>
                                    <li>{it.L('Redeem the cloned tokens for dividends from Binary Group Ltd')}</li>
                                </ul>
                                <p>{it.L('In the latter case, tokenholders will need to log in to their [_1] account, authenticate their account in accordance with KYC requirements, and deposit the cloned tokens using the facilities that we’ll provide in return for dividends.', it.broker_name)}</p>
                                <p>{it.L('Dividends will generally be distributed once a year.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How can I convert my tokens into ordinary shares?')}</h4>
                                <p>{it.L('Tokenholders who wish to convert their tokens into ordinary shares must serve us with a conversion notice – in line with the terms of the tokens.')}</p>
                                <p>{it.L('The terms cover market value, jurisdictions, KYC and AML procedures, and necessary regulatory approvals. You may refer to the Information Memorandum (pp. 20-21) for more details.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What’s the difference between securities tokens and utility tokens?')}</h4>
                                <p>{it.L('Securities tokens are tokens that derive their value from an external asset or represent traditional financial assets.')}</p>
                                <p>{it.L('Utility tokens are tokens that give you access to decentralised networks or applications.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What is a Dutch auction? How does [_1] determine the final bid price per token and how will I know if my bid is successful?', it.broker_name)}</h4>
                                <p>{it.L('The price per token is determined by a Dutch auction where investors will enter bids for how many tokens they want to purchase at different prices. Once the bidding period is over, all accepted bids will be arranged from the highest to lowest price until all our tokens have been assigned, as per the process described in the Information Memorandum. The lowest price among all allotted tokens will be the final price that everyone pays.')}</p>
                                <p>{it.L('This means that the price of the token is determined by market demand, and not [_1].', it.broker_name)}</p>
                                <p>{it.L('To find out if your bid is successful, you may refer to the ‘ICO Auction Bids’ section on the [_1]ICO bidding page[_2].', `<a href=${it.url_for('user/ico-subscribe')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('How can I place a bid?')}</h4>
                                <p>{it.L('To place a bid, just enter the number of tokens you’d like to purchase and the price you’re willing to pay per token into the bid form on the [_1]ICO bidding page[_2].', `<a href=${it.url_for('user/ico-subscribe')} target='_blank' rel='noopener noreferrer'>`, '</a>')}</p>
                                <p>{it.L('To place a bid, you only need to place an initial deposit equivalent to 5% of the total amount. Your bids can be cancelled at any time before the end of the auction at no cost.')}</p>
                                <p>{it.L('After the bidding period is over and the final price of the token has been decided, you will have two weeks to pay the balance owed depending on the final price of the token.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What is the definition of a professional investor?')}</h4>
                                <p>{it.L('The definition of a professional investor varies based on jurisdiction. In essence, a professional investor refers to an investor who’s more experienced and is able to evaluate an investment opportunity with a full understanding of the risks involved.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Can I bid on your tokens in cryptocurrencies such as Bitcoin?')}</h4>
                                <p>{it.L('Yes, we support multiple crypto (Bitcoin, Bitcoin Cash, Ethereum, and Litecoin) and fiat (AUD, EUR, GBP, and USD) currencies.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Are there any minimum requirements per bid?')}</h4>
                                <p>{it.L('Yes. Bidding starts at USD 1.35 per token with a minimum number of 25 tokens per bid. The final token price will be determined after the bidding period is over.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Why was my bid unsuccessful?')}</h4>
                                <p>{it.L('Your bid was unsuccessful because it was lower than the final token price. A higher bid will give you a higher chance for a successful bid.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What happens once I’ve claimed the tokens?')}</h4>
                                <p>{it.L('Once you’ve claimed your tokens, you are entitled to the following rights:')}</p>
                                <ul className='bullet'>
                                    <li>{it.L('The right to receive dividend payments equivalent to dividends paid on Binary Group Ltd ordinary shares')}</li>
                                    <li>{it.L('The right to convert your tokens into ordinary shares')}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What is an ERC20 token?')}</h4>
                                <p>{it.L('An ERC20 token is a type of token based on the ERC20 token standard used for Ethereum smart contracts. It’s considered to be one of the most significant token standards ever created for the Ethereum blockchain.')}</p>
                                <p>{it.L('We decided to adopt the ERC20 token as it possesses unique features that are appropriate for a securities token.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Can I sell my ERC20 tokens once they are listed on the [_1]Lykke.com[_2] Exchange?', '<a href="https://www.lykke.com/" target="_blank" rel="noopener noreferrer">', '</a>')}</h4>
                                <p>{it.L('Yes, you can freely trade your tokens after they are listed on the [_1]Lykke.com[_2] exchange or any other cryptocurrency exchange that chooses to list our tokens in the future.', '<a href="https://www.lykke.com/" target="_blank" rel="noopener noreferrer">', '</a>')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Can [_1] tokens be mined?', it.broker_name)}</h4>
                                <p>{it.L('No. [_1] tokens are securities-backed tokens which come with exclusive tokenholder rights. They cannot be mined.', it.broker_name)}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('What will be the total shares issued after the ICO?')}</h4>
                                <p>{it.L('This depends on the number of tokens that will be issued after the ICO.')}</p>
                                <p>{it.L('If the maximum number of tokens (10 million) offered in the token sale are issued, then the number of shares issued after the ICO will total 220,257,430 shares.')}</p>
                                <p>{it.L('If the minimum number of tokens (three million) offered in the token sale are issued, then the number of shares issued after the ICO will total 213,257,430 shares.')}</p>
                            </div>
                        </div>
                        <div className='gr-12'>
                            <div className='faq'>
                                <h4>{it.L('Is there a pre-ICO?')}</h4>
                                <p>{it.L('No.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Subscribe section*/}
            <div className='fill-bg-color center-text content-section-sm' id='ico_subscribe_section'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2>{it.L('Subscribe to our mailing list')}</h2>
                        <p>{it.L('for exclusive updates on the ICO.')}</p>
                        <div className='form-container'>
                            {/* AWeber Web Form Generator 3.0.1*/}
                            <form id='binary_ico_subscribe' method='post' className='af-form-wrapper' acceptCharset='UTF-8' action='https://www.aweber.com/scripts/addlead.pl'>
                                <div style={{ display: 'none' }}>
                                    <input type='hidden' name='meta_web_form_id' value='713141817' />
                                    <input type='hidden' name='meta_split_id' value='' />
                                    <input type='hidden' name='listname' value='awlist4685103' />
                                    <input type='hidden' name='redirect' value='' id='redirect_600c7e6a647457c51ede13e8b4d377e6' />
                                    <input type='hidden' name='meta_adtracking' value='Binary_ICO' />
                                    <input type='hidden' name='meta_message' value='1001' />
                                    <input type='hidden' name='meta_required' value='email' />
                                    <input type='hidden' name='meta_tooltip' value='' />
                                    <input type='hidden' name='custom language' value='' className='frm-language' />
                                </div>
                                <div id='af-form-713141817' className='af-form'>
                                    <div id='af-body-713141817' className='gr-12 gr-12-m af-body af-standards'>
                                        <div className='af-element gr-row'>
                                            <div className='gr-8 gr-12-m'>
                                                <input className='text' placeholder={it.L('Enter your email')} id='awf_field-90867273' type='text' name='email' value='' tabIndex='500' />
                                            </div>
                                            <div className='gr-4 gr-12-m'>
                                                <input name='submit' id='af-submit-image-713141817' type='submit' className='image' alt='Submit' tabIndex='501' value={it.L('Submit')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'none' }}>
                                        <img src='https://forms.aweber.com/form/displays.htm?id=7IzMjCyMHIzs' alt='' />
                                    </div>
                                </div>
                            </form>
                            {/* eslint-disable quotes */}
                            <script type='text/javascript' dangerouslySetInnerHTML={{ __html: `document.getElementById('redirect_600c7e6a647457c51ede13e8b4d377e6').value = document.location + '#done';` }}></script>
                            {/* eslint-enable quotes */}
                            {/* /AWeber Web Form Generator 3.0.1*/}
                            <div id='subscribe_success' className='gr-8 gr-12-m gr-centered invisible'>
                                <p className='notice-msg'>{it.L('Thanks for subscribing! Keep an eye on your inbox for the latest updates on our ICO.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='primary-bg-color content-inverse-color center-text'>
                <div className='footnote'>
                    <p>{it.L('Access to electronic versions of these materials is being made available by Binary Group Ltd. (“Company”) in good faith and for information purposes only. It does not constitute an offer of, or an invitation to purchase, the tokens or any securities.  Making press announcements and other documents available in electronic format does not constitute, or shall not be deemed to constitute, or form part of, an offer to sell or the solicitation of an offer to buy or otherwise deal in the tokens or any other securities. Further, it does not constitute a recommendation by the Company or any other party to sell or buy tokens or any other securities.')}</p>
                    <p>{it.L('These materials and the proposed ICO do not constitute an offer of, or an invitation to purchase, the tokens or any securities in any jurisdiction in which such offer or sale would be unlawful. In particular, unless otherwise determined by the Company, and permitted by applicable law and regulation, it is not intended that any offering of the tokens or any securities should be made, or any documentation be sent, directly or indirectly, in or into, Australia, the British Virgin Islands, Canada,  Japan, Jersey, New Zealand, Singapore, South Africa, Switzerland, or the United States (“Restricted Territory”) and nor should it be accessed by any person who is a national citizen or resident of a Restricted Territory, including corporations, partnerships, or other entities created or organised in any such jurisdiction.')}</p>
                    <p>{it.L('These materials may only be received by authorised persons (a person determined by the Company, in its sole discretion, entitled to receive the materials as prescribed by applicable laws and regulations, for example in EEA jurisdictions, pursuant to an exemption under the European Union\'s directive 2003/71/EC (as amended, including by directive 2010/73/EU), which includes, without limitation, the exemption relating to qualified investors (“Authorised Persons”). If an Authorised Person wishes to bid for tokens he may do so if he is registered client of Binary.com and has a Binary.com account, by which method the Company shall be able to verify his qualification as an Authorised Person. The Authorised Person who wishes to acquire tokens will make a bid.  The Company will collate and assess the bids.  The Company may request that bids are reconfirmed before they are considered valid for the purpose of the Company’s offer at the auction.  At the auction the Company will make an offer for the tokens, which offer will be accepted (by the auction process explained in the materials) by the bids, and the consideration for the purchase of such tokens offered and accepted will be settled by credit in the Authorised Person’s Binary.com account, which evidences the contract for sale and purchase of the respective tokens.')}</p>
                    <p>{it.L('For the avoidance of doubt (and notwithstanding anything to the contrary), these materials are not an offer for tokens; they are an invitation to treat.  Tokens will may only be offered by the Company pursuant to an auction in the manner more particularly described in the ‘token auction process’ section of the materials.')}</p>
                    <p>{it.L('Neither the United States securities and exchange commission nor any state, provincial or territorial securities commission nor any other regulatory authority of any country or jurisdiction has approved or disapproved of the proposed offer of tokens.')}</p>
                    <p>{it.L('In regards to EEA jurisdictions, it is intended that the token offering will be made pursuant to an exemption under the European Union\'s directive 2003/71/EC (as amended, including by directive 2010/73/EU), which includes, without limitation, the exemption relating to qualified investors, the offer of tokens is similarly expected to be restricted to qualified or professional investors in a number of other jurisdictions; further details of such restrictions will be detailed in the offer information memorandum.')}</p>
                    <p>{it.L('Investment in the proposed tokens is expected to involve a high degree of risk, there will be no assurance that tokenholders will be able to receive a return of their capital or any returns on their investment. Prospective investors in the tokens should carefully consider the risk factors that will be detailed in the materials.')}</p>
                </div>
            </div>
            <div id='address' className='primary-bg-color-dark content-inverse-color center-text gr-padding-20'>
                <span>Binary Group Ltd., Kingston Chambers, Road Town, Tortola, British Virgin Islands</span>
            </div>
            <div id='ico-bottom-banner' className='gr-hide gr-show-m gr-12-m invisible' data-url={it.url_for('user/ico-subscribe')}>
                <p className='center-text'>{it.L('The [_1] ICO is now live. Participate now!', it.broker_name)}</p>
            </div>
            {/* [if (lt IE 9)]><script src='https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.2.4/min/tiny-slider.helper.ie8.js'></script><![endif] */}
            <script src='https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.2.4/min/tiny-slider.js'></script>
            <script src={`${it.url_for('js/landing_pages/common.js')}?${it.static_hash}`}></script>
            <script src={`${it.url_for('js/landing_pages/ico.js')}?${it.static_hash}`}></script>
            </body>
        </html>
    );
};

export default Ico;
