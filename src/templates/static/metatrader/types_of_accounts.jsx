import React from 'react';
import { Table } from '../../_common/components/elements.jsx';
import Loading from '../../_common/components/loading.jsx';

const Box = ({ image, text, title, className }) => (
    <div className={`gr-padding-10${className ? ` ${className}` : ''}`}>
        <div className='box'>
            <div className='gr-row gr-row-align-middle'>
                <div className='gr-2 gr-3-p gr-12-m center-text gr-centered'>
                    <img className='gr-padding-10 gr-parent' src={it.url_for(`images/pages/metatrader/icons/acc_${image}.svg`)} />
                    <h3 className='center-text secondary-color no-margin'>{title}</h3>
                </div>
                <div className='gr-10 gr-9-p gr-12-m'>
                    <p className='no-margin'>{text}</p>
                </div>
            </div>
        </div>
    </div>
);

const FootNote = ({ number, texts, title }) => (
    <div className='gr-padding-10'>
        <a name={`note-${number}`} />
        <h3 className='secondary-color'>{`${number}. ${title}`}</h3>
        <div className='separator-line border-bottom' />
        { texts.map((text, idx) => (
            <p key={idx}>{text}</p>
        ))}
    </div>
);

const Row = ({ number, text }) => (
    <React.Fragment>
        {text}
        <a href={`#note-${number}`} className='sup'>{number}</a>
    </React.Fragment>
);

const TypesOfAccounts = () => (
    <div id='mt5_types_of_accounts' className='static_full'>
        <h1>{it.L('Types of MetaTrader 5 accounts')}</h1>

        <div id='loading_types'>
            <Loading />
        </div>

        <div id='content_types' className='invisible'>
            <p>{it.L('[_1] offers a variety of account types to cater to the diverse needs of traders everywhere, whether you are an experienced trader or just starting out. Each account has been tailored to provide you with a unique opportunity to trade financial instruments.', it.website_name)}</p>
            <p>{it.L('Best of all, there is no minimum deposit requirement.')}</p>
            <Box
                className='invisible show-maltainvest'
                image='standard'
                title={it.L('Financial')}
                text={it.L('The Financial account (available in EUR and GBP) is suitable for a wide range of traders, both new or experienced. Trade commodities, cryptocurrencies, major and minor currency pairs with tight and variable spreads without commissions and a minimum deposit.')}
            />
            <Box
                className='hide-maltainvest'
                image='standard'
                title={it.L('Financial')}
                text={it.L('The Financial account offers new and experienced traders high leverage and variable spreads for maximum flexibility. Trade commodities, cryptocurrencies, major (standard and micro-lots), and minor currency pairs with high leverage.')}
            />
            <Box
                className='hide-maltainvest'
                image='advanced'
                title={it.L('Financial STP')}
                text={it.L('The Financial Straight-Through Processing (STP) account is a 100% A Book account where your trades are passed straight through to the market, giving you direct access to forex liquidity providers. Trade major, minor, and exotic currency pairs with tight spreads and higher trade volumes.')}
            />
            <Box
                image='volatility_indices'
                title={it.L('Synthetic')}
                text={it.L('The Synthetic account allows you to trade contracts for difference (CFDs) on synthetic indices that mimic real-world movements. Available for trading 24/7 and audited for fairness by an independent third party.')}
            />
           
            <p className='hint' data-show='-eucountry' >{`${it.L('Note:')} ${it.L('To protect your portfolio from adverse market movements due to the market opening gap, we reserve the right to decrease leverage on all offered symbols for financial accounts before market close and increase it again after market open. Please make sure that you have enough funds available in your MT5 account to support your positions at all times.')}`}</p>
           
            <div className='gr-padding-30' />

            <h2 className='center-text'>{it.L('Account comparison')}</h2>
            <div className='gr-padding-10'>
                <div className='hide-maltainvest'>
                    <Table
                        scroll
                        data={{
                            thead: [
                                [{ text: '' }, { text: it.L('Financial') }, { text: it.L('Financial STP') }, { text: it.L('Synthetic') }],
                            ],
                            tbody: [
                                [{ text: <Row             text={it.L('Account currency')} /> },       { text: it.L('USD') },                                                                       { text: it.L('USD') },                               { text: it.L('USD') }],
                                [{ text: <Row number={1}  text={it.L('Leverage')} /> },               { text: it.L('Up to [_1]', '1:1000') },                                                      { text: it.L('Up to [_1]', '1:100') },               { text: it.L('Up to [_1]', '1:1000') }],
                                [{ text: <Row number={2}  text={it.L('Order execution')} /> },        { text: it.L('Market') },                                                                    { text: it.L('Market') },                            { text: it.L('Market') }],
                                [{ text: <Row number={3}  text={it.L('Spread')} /> },                 { text: it.L('Variable') },                                                                  { text: it.L('Variable') },                          { text: it.L('Variable/Fixed') }],
                                [{ text: <Row number={4}  text={it.L('Commission')} /> },             { text: it.L('No') },                                                                        { text: it.L('No') },                                { text: it.L('No') }],
                                [{ text: <Row             text={it.L('Minimum deposit')} /> },        { text: it.L('No') },                                                                        { text: it.L('No') },                                { text: it.L('No') }],
                                [{ text: <Row number={5}  text={it.L('Margin call')} /> },            { text: '150%' },                                                                            { text: '150%' },                                    { text: '100%' }],
                                [{ text: <Row number={6}  text={it.L('Stop out level')} /> },         { text: '75%' },                                                                             { text: '75%' },                                     { text: '50%' }],
                                [{ text: <Row             text={it.L('Number of assets')} /> },       { text: '50+' },                                                                             { text: '50+' },                                     { text: '10+' }],
                                [{ text: <Row number={7}  text={it.L('Cryptocurrency trading')} /> }, { text: '24/7' },                                                                            { text: 'N/A' },                                     { text: it.L('N/A') }],
                                [{ text: <Row             text={it.L('Trading instruments')} /> },    { text: it.L('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies') }, { text: it.L('FX-majors, FX-minors, FX-exotics') },  { text: it.L('Synthetics') }],
                            ],
                        }}
                        tbody_id='instruments'
                    />
                </div>
                <div className='invisible show-maltainvest'>
                    <Table
                        scroll
                        data={{
                            thead: [
                                [{ text: '' }, { text: it.L('Financial') }, { text: it.L('Synthetic') }],
                            ],
                            tbody: [
                                [{ text: <Row             text={it.L('Account currency')} /> },       { text: it.L('EUR/GBP') },                                                                   { text: it.L('EUR') }],
                                [{ text: <Row number={1}  text={it.L('Leverage')} /> },               { text: it.L('Up to [_1]', '1:30') },                                                        { text: it.L('Up to [_1]', '1:1000') }],
                                [{ text: <Row number={2}  text={it.L('Order execution')} /> },        { text: it.L('Market') },                                                                    { text: it.L('Market') }],
                                [{ text: <Row number={3}  text={it.L('Spread')} /> },                 { text: it.L('Variable') },                                                                  { text: it.L('Variable/Fixed') }],
                                [{ text: <Row number={4}  text={it.L('Commission')} /> },             { text: it.L('No') },                                                                        { text: it.L('No') }],
                                [{ text: <Row             text={it.L('Minimum deposit')} /> },        { text: it.L('No') },                                                                        { text: it.L('No') }],
                                [{ text: <Row number={5}  text={it.L('Margin call')} /> },            { text: '100%' },                                                                            { text: '100%' }],
                                [{ text: <Row number={6}  text={it.L('Stop out level')} /> },         { text: '50%' },                                                                             { text: '50%' }],
                                [{ text: <Row             text={it.L('Number of assets')} /> },       { text: '50+' },                                                                             { text: '10+' }],
                                [{ text: <Row number={7}  text={it.L('Cryptocurrency trading')} /> }, { text: '24/7' },                                                                            { text: it.L('N/A') }],
                                [{ text: <Row             text={it.L('Trading instruments')} /> },    { text: it.L('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies') }, { text: it.L('Synthetics') }],
                            ],
                        }}
                    />
                </div>
            </div>

            <p className='hint'>{`${it.L('Note:')} ${it.L('At bank rollover, liquidity in the forex market is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT during non-daylight saving time.')}`}</p>

            <div className='gr-padding-10' />

            <FootNote
                number={1}
                title={it.L('Leverage')}
                texts={[it.L('Leverage gives you the ability to trade a larger position using your existing capital.')]}
            />
            <FootNote
                number={2}
                title={it.L('Order execution')}
                texts={[
                    it.L('Order execution typically comes in two varieties: market execution and instant execution. With market execution, you will place an order at the broker\'s price. You agree on the price in advance. There are no requotes with market execution.'),
                    it.L('What about instant execution? In this case, your order is placed at the price that\'s available at that time. Requotes are possible if the price fluctuates a great deal before the order execution is complete.'),
                ]}
            />
            <FootNote
                number={3}
                title={it.L('Spread')}
                texts={[it.L('The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on the market conditions. A fixed spread means that the spread is not affected by market conditions but it is subject to alteration at the Company\'s absolute discretion.')]}
            />
            <FootNote
                number={4}
                title={it.L('Commission')}
                texts={[it.L('Most brokers typically charge a commission for each trade that you place. [_1] currently charges no commission across all account types, except for cryptocurrencies.', it.website_name)]}
            />
            <FootNote
                number={5}
                title={it.L('Margin call')}
                texts={[it.L('When the remaining funds in your account is unable to cover the leverage or margin requirement, your account will be placed under margin call. To prevent a margin call escalating into a stop out level, you can deposit additional funds into your account or close any open positions.')]}
            />
            <FootNote
                number={6}
                title={it.L('Stop out level')}
                texts={[it.L('If your account is placed under margin call for an extended period of time, it will reach the stop out level where it is unable to sustain an open position. This will lead to your pending orders being cancelled and your open positions being forcibly closed (also known as “forced liquidation”).')]}
            />
            <FootNote
                number={7}
                title={it.L('Cryptocurrency trading')}
                texts={[it.L('Indicates the availability of cryptocurrency trading on a particular account.')]}
            />
        </div>
    </div>
);

export default TypesOfAccounts;
