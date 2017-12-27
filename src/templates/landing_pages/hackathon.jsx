import React from 'react';
import Title from '../_common/components/title.jsx';
import Favicons from '../_common/includes/favicons.jsx';
import AntiClickjack from '../_common/includes/anti_clickjack.jsx';

const Head = () => (
    <head>
        <AntiClickjack />
        <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
        <meta httpEquiv='Content-Language' content={it.language} />
        <meta name='description' content={`${it.broker_name} Hackathon Competition`} />
        <meta name='keywords' content='binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading, hackathon' />
        <meta name='author' content={it.broker_name} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
        <meta name='dcterms.rightsHolder' content={it.broker_name} />
        <meta name='dcterms.rights' content={it.broker_name} />
        <meta property='og:title' content={it.broker_name} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />

        <Title />
        <Favicons />

        <link href={it.url_for(`css/hackathon.css?${it.static_hash}`)} rel='stylesheet' />
    </head>
);

const Hackathon = () => (
    <html>
        <Head />
        <body>
            <div className='navbar' id='navigation'>
                <div className='container'>
                    <div className='navbar-header'>
                        <a className='navbar-brand page-scroll logo' href='#page-top' />
                    </div>
                    <div className='navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            <li className='invisible'>
                                <a href='#page-top' />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section id='page-top' className='intro'>
                <h1 className='text-uppercase'>
                    <span className='text-bold'>Hackathon </span><span className='text-thin'>Competition</span>
                </h1>
                <div className='intro-bg' />
                <div id='register' className='white-bg'>
                    <div className='container'>
                        <h1>Thank you for all those who participated.</h1>
                        <h3>Stay tuned for updates on our next Hackathon competition!</h3>
                    </div>
                </div>
            </section>

            <footer className='text-center'>
                <div className='container'>
                    <p>
                        Visit our
                        <a className='text-bold' target='_blank' rel='noopener noreferrer' href='https://www.binary.com/en/careers.html'>career page</a>
                         for more opportunities at Binary!
                    </p>
                </div>
            </footer>

            <script src={it.url_for(`js/landing_pages/common.js?${it.static_hash}`)} />
            <script src={it.url_for(`js/landing_pages/hackathon.js?${it.static_hash}`)} />
        </body>
    </html>
);

export default Hackathon;
