import React from 'react';

const Box = ({ boxes }) => (
    <div className='gr-row'>
        { boxes.map((box, idx) => (
            <div className='list gr-6 gr-no-gutter-t gr-no-gutter-p gr-no-gutter-m' key={idx}>
                <div className='section fill-bg-color'>
                    <a href={it.url_for(`get-started-old/${box.id}`)}>
                        <div id={box.id}></div>
                        <div className='section-header'>{box.header}</div>
                    </a>
                    <div className='section-info gr-padding-10 gr-gutter'>{box.info}</div>
                </div>
            </div>
        ))}
    </div>
);

const Index = () => (
<div className='center-text'>
    <Box boxes={[
        { id: 'what-is-binary-trading', header: it.L('Why choose binary trading?'), info: it.L('Learn about one of the fastest growing sectors of the finance industry.') },
        { id: 'types-of-trades',        header: it.L('Types of trades'),            info: it.L('Read about the five types of trade offered by [_1].', it.website_name) },
    ]} />
    <Box boxes={[
        { id: 'binary-options-basics', header: it.L('Binary options basics'),        info: it.L('Learn the basics, from choosing your asset to winning your payout.') },
        { id: 'why-trade-with-us',     header: it.L('Benefits of trading binaries'), info: it.L('Learn about the simplicity, transparency and flexibility of binary trading.') },
    ]} />
    <Box boxes={[
        { id: 'how-to-trade-binaries', header: it.L('How to trade binary options?'), info: it.L('Follow a simple step-by-step guide to binary trading.') },
        { id: 'beginners-faq',         header: it.L('FAQ'),                          info: it.L('Read the answers to some common questions.') },
    ]} />
    <Box boxes={[
        { id: 'volidx-markets', header: it.L('How to trade the Volatility Indices markets?'), info: it.L('Discover our Volatility Indices.') },
        { id: 'smart-indices',  header: it.L('Smart Markets'),                                info: it.L('Discover our Smart Markets.') },
    ]} />
    <Box boxes={[
        { id: 'glossary', header: it.L('Glossary'), info: it.L('Check out some technical terms before you start.') },
    ]} />
</div>
);

export default Index;
