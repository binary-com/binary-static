import React from 'react';

const BoxInner = ({ className = '', href, image, text }) => (
    <div className={`gr-6 center-text ${className}`}>
        { href ?
            <React.Fragment>
                <a href={it.url_for(href)}>
                    <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                </a>
                <p>{text}</p>
            </React.Fragment>
            :
            <React.Fragment>
                <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                <p>{text}</p>
            </React.Fragment>
        }
    </div>
);

const Box = ({ children }) => (
    <div className='gr-6 gr-12-m'>
        <div className='gr-row'>
            {children}
        </div>
    </div>
);


const Index = () => (
    <div className='about-us box-inlay-borders static_full'>
        <div className='container section'>
            <div className='gr-parent'>
                <h1 className='center-text gr-padding-20'>
                    {it.L('The premier platform for trading binary options in the world\'s financial markets')}
                </h1>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m gr-padding-20'>
                        <img className='mac ja-hide' src={it.url_for('images/pages/about/mac.svg')} />
                        <img className='mac invisible ja-show responsive' src={it.url_for('images/pages/about/mac-ja.png')} />
                    </div>
                    <div className='gr-1 gr-hide-t gr-hide-p gr-hide-m' />
                    <div className='gr-5 gr-12-m'>
                        <p>{it.L('Founded in 1999, [_1] is one of the oldest and most respected names in online binary trading.', it.website_name)}</p>
                        <p>{it.L('Using our website, customers can trade currencies, indices, stocks and commodities 24/7. We have the most flexible pricing and the most comprehensive suite of products available.')}</p>
                        <p>{it.L('[_1] has earned an enviable reputation for our commitment to high ethical standards and the quality of the trading experience we provide.', it.website_name)}</p>
                        <p>{it.L('When you trade with [_1], you can be assured that your deposits are held in a separate trust account and are not used for any other purpose.', it.website_name)}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='fill-bg-color'>
            <div className='container section'>
                <div className='gr-padding-10 facts'>
                    <h1 className='center-text gr-padding-20'>{it.L('Key facts')}</h1>
                    <div className='gr-row border-bottom no-padding'>
                        <Box>
                            <BoxInner className='border-right-top' href='/group-history' image='founded' text={it.L('<a href=\'[_1]\'>Founded</a> October 1999', it.url_for('group-history'))} />
                            <BoxInner className='border-right-top' image='debt-free' text={it.L('Debt-free')} />
                        </Box>
                        <Box>
                            <BoxInner className='border-right-top' href='/careers' image='staff' text={it.L('Over [_1] <a href=\'[_2]\'>staff</a> and contractors worldwide', '130', it.url_for('careers'))} />
                            <BoxInner image='1mil' text={it.L('Over 1 million registered accounts worldwide')} />
                        </Box>
                    </div>
                    <div className='gr-row gr-parent'>
                        <Box>
                            <BoxInner className='border-right-bottom gr-padding-30' image='transacts' text={it.L('Binary\'s platform transacts on average [_1] [_2]transactions[_3] per second, 24/7', '20', '<a href=\'https://binarycom.statuspage.io/\' target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>')} />
                            <BoxInner className='border-right-bottom gr-padding-30' href='/contact' image='locations' text={it.L('<a href=\'[_1]\'>Offices</a> in Malta, Malaysia and Japan', it.url_for('contact'))} />
                        </Box>
                        <Box>
                            <BoxInner className='border-right-bottom gr-padding-30' image='license' text={it.L('Licensed and regulated in Malta, the United Kingdom, the Isle of Man, Ireland, and Japan')} />
                            <BoxInner className='gr-padding-30' image='languages' text={it.L('Published in English, Indonesian, Japanese, Chinese, Polish, German, French, Portuguese, Russian, and Thai')} />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='gr-parent'>
                <p>{it.L('[_1] is owned and operated by the Binary Group Ltd. group of companies. For more information, <a href=\'[_2]\'>visit our history page</a>.', it.website_name, it.url_for('group-history'))}</p>
                <p>{it.L('In the UK, our clients trade through Binary (IOM) Ltd and Binary Investments (Europe) Ltd. In the Isle of Man, they trade through Binary (IOM) Ltd. In Japan, they trade through Binary KK. In the European Union (except UK), they trade through Binary (Europe) Ltd and Binary Investments (Europe) Ltd. In the rest of the world, they trade through Binary (C.R.) S.A.')}</p>
            </div>
        </div>
    </div>
);

export default Index;
