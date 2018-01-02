import React from 'react';

const Image = () => (
    <div className='gr-row'>
        { Array.from(new Array(3)).map((x, inx) => (
            <div key={inx} className='gr-4'><img className='responsive' src={it.url_for(`images/pages/home/step-${  inx+1  }.svg`)} /></div>
        ))}
    </div>
);

const StrongP = () => {
    const paragraphs = [it.L('Define your position'), it.L('Get your price'), it.L('Make your trade')];

    return (
        <div className='gr-row'>
            { paragraphs.map((p, inx) => (
                <div key={inx} className='gr-4'>
                    <p className='center-text'>
                        <strong>{p}</strong>
                    </p>
                </div>
            ))}
        </div>
    );
};

const Li = ({ header, description, children }) => (
    <li>
        <strong>{header}</strong>
        <p>{description}</p>
        {children}
    </li>
);

const HowToTradeBinaries = () => (
    <div className='section-content section-5'>
        <h1>{it.L('How to trade binary options?')}</h1>

        <div className='first subsection'>
            <a name='binary-trading-in-3-easy-steps-section'></a>

            <Image />
            <StrongP />

            <div>
                <a name='define-your-position-section'></a>
                <h2>{it.L('Step 1: Define your position')}</h2>
                <p>{it.L('Trading binary options is relatively easy, and you can purchase a trade in only three simple steps.')}</p>
                <p>{it.L('First, you need to set the parameters of your trade. Here\'s what you need to consider.')}</p>
            </div>

            <img className='responsive' src={it.url_for('images/pages/get-started/define-your-position.svg')} />
            <ol>
                <Li
                    header={it.L('Underlying market')}
                    description={it.L('Choose the asset you wish to trade, such as gold, oil, stocks, or currency pairs. The value of a binary option is derived from the price of the underlying asset. One advantage of trading binary options is that you are not buying or selling the actual asset, only a contract that determines how that asset performs.')}
                >
                    <p>{it.L('Choose from five types of markets and their respective assets:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Currencies - All major Forex pairs')}</li>
                        <li>{it.L('Indices - All major worldwide stock indices sourced from the over-the-counter market')}</li>
                        <li>{it.L('Commodities - Major commodities such as gold and oil')}</li>
                        <li>{it.L('OTC stocks - Blue-chip stock contracts sourced from the over-the-counter market')}</li>
                        <li>{it.L('Volatility indices - [_1]\'s proprietary indices that simulate market forces', it.website_name)}</li>
                    </ul>
                </Li>
                <Li header={it.L('Trade type')} description={it.L('There are four main trade types for you to choose from:')}>
                    <ul className='bullet'>
                        <li>{it.L('Rise/Fall - Predict if the market will rise or fall from its current level')}</li>
                        <li>{it.L('Higher/Lower - Predict if the market will end higher or lower than a target price')}</li>
                        <li>{it.L('Touch/No Touch - Predict if the market will touch or not touch a target price')}</li>
                        <li>{it.L('In/Out - Predict if the market will stay between or outside two target prices')}</li>
                    </ul>
                </Li>
                <Li header={it.L('Duration')}   description={it.L('Set the length of your trade, from 10 seconds to 365 days.')} />
                <Li header={it.L('Barrier(s)')} description={it.L('Set barrier(s) to define your position and trigger the payout you will receive.')} />
                <Li header={it.L('Payout')}     description={it.L('Each trade comes with a pre-determined payout that you will see after adjusting each parameter. You’ll win the payout if your prediction is correct. If not, you will only lose your initial stake.')} />
            </ol>
        </div>

        <div className='subsection invisible'>
            <a name='get-your-price-section'></a>
            <h2>{it.L('Step 2: Get your contract price')}</h2>
            <p>{it.L('Our prices are benchmarked against the interbank options market. You’ll receive fair and transparent pricing, whatever your position.')}</p>
        </div>

        <div className='subsection invisible'>
            <a name='make-your-trade-section'></a>
            <h2>{it.L('Step 3: Make your trade')}</h2>
            <p>{it.L('When you are satisfied with the price that you receive, execute your trade immediately. With our unique platform, you won’t have to contend with ‘slippages’ or gaping markets. And most importantly, there are no invisible fees. You can also sell back any long-term trades at any time before they expire to protect the profit you may have earned or to minimise your losses.')}</p>
        </div>

        <div className='subsection last invisible'>
            <a className='client_logged_out invisible' name='dont-just-read-about-it-section'></a>

            <h2>{it.L('Interested? Why not try a virtual account')}</h2>
            <p>{it.L('Test-run [_1], and sharpen your trading skills, with a no-risk, no-commitment, virtual account.', it.website_name)}</p>

            <Image />
            <StrongP />

            <div className='gr-padding-10 center-text client_logged_out invisible'>
                <a className='button' href={it.url_for('/')}><span>{it.L('Try it now')}</span></a>
                <p>{it.L('No risk, $10K virtual money account')}</p>
            </div>
        </div>

        <div className='subsection-navigation center-text gr-padding-20'>
            <a className='back button' href='javascript:;'><span>{it.L('Back')}</span></a>
            <a className='next button' href='javascript:;'><span>{it.L('Next')}</span></a>
        </div>
    </div>
);

export default HowToTradeBinaries;
