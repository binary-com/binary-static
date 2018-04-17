import React from 'react';
import { Table } from '../../_common/components/elements.jsx';

const Box = ({ image, text, title }) => (
    <div className='gr-padding-10'>
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
        <p>{it.L('[_1] offers a variety of account types to cater to the diverse needs of traders everywhere, whether you are an experienced trader or just starting out. Each account has been tailored to provide you with a unique opportunity to trade financial instruments.', it.website_name)}</p>
        <p>{it.L('Best of all, there is no minimum deposit requirement.')}</p>
        <Box
            image='standard'
            title={it.L('Standard')}
            text={it.L('The Standard account is suitable for a wide range of traders, both new and experienced. It gives you mid-range leverage and variable spreads that give you a great deal of flexibility for whatever position you wish to take in the market.')}
        />
        <Box
            image='advanced'
            title={it.L('Advanced')}
            text={it.L('The Advanced account provides you with tight spreads, higher ticket size and offers more products. Start trading on more forex pairs, CFD indices, futures and cryptocurrencies.')}
        />
        <Box
            image='volatility_indices'
            title={it.L('Volatility Indices')}
            text={it.L('The Volatility Indices account allows you to trade CFDs on Volatility Indices – our proprietary synthetic assets that mimic real-world market volatility and are available for trading 24/7.')}
        />

        <div className='gr-padding-30' />

        <h2 className='center-text'>{it.L('Account comparison')}</h2>
        <div className='gr-padding-10'>
            <Table
                scroll
                data={{
                    thead: [
                        [{ text: '' }, { text: it.L('Standard') }, { text: it.L('Advanced') }, { text: it.L('Volatility Indices') }],
                    ],
                    tbody: [
                        [{ text: <Row number={1}  text={it.L('Account currency')} />},       { text: it.L('USD') },                    { text: it.L('USD') },                    { text: it.L('USD/EUR') }],
                        [{ text: <Row number={2}  text={it.L('Maximum leverage')} />},       { text: it.L('Up to 1:500') },            { text: it.L('Up to 1:100') },            { text: it.L('Up to 1:500') }],
                        [{ text: <Row number={3}  text={it.L('Order execution')} />},        { text: it.L('Market') },                 { text: it.L('Market') },                 { text: it.L('Market') }],
                        [{ text: <Row number={4}  text={it.L('Spread')} />},                 { text: it.L('Variable from 1.2 pips') }, { text: it.L('Variable from 0.9 pips') }, { text: it.L('Fixed') }],
                        [{ text: <Row number={5}  text={it.L('Commission')} />},             { text: it.L('No') },                     { text: it.L('No') },                     { text: it.L('No') }],
                        [{ text: <Row number={6}  text={it.L('Minimum deposit')} />},        { text: it.L('No') },                     { text: it.L('No') },                     { text: it.L('No') }],
                        [{ text: <Row number={7}  text={it.L('Margin call')} />},            { text: it.L('150%') },                   { text: it.L('150%') },                   { text: it.L('100%') }],
                        [{ text: <Row number={8}  text={it.L('Stop out level')} />},         { text: it.L('75%') },                    { text: it.L('75%') },                    { text: it.L('50%') }],
                        [{ text: <Row number={9}  text={it.L('Number of assets')} />},       { text: it.L('60+') },                    { text: it.L('80+') },                    { text: it.L('8') }],
                        [{ text: <Row number={10} text={it.L('Maximum ticket size')} />},    { text: it.L('10 lots') },                { text: it.L('50 lots') },                { text: it.L('30 lots') }],
                        [{ text: <Row number={11} text={it.L('Minimum ticket size')} />},    { text: it.L('0.01 lots') },              { text: it.L('0.01 lots') },              { text: it.L('0.01 lots') }],
                        [{ text: <Row number={12} text={it.L('Step size')} />},              { text: it.L('0.01 lots') },              { text: it.L('0.01 lots') },              { text: it.L('0.01 lots') }],
                        [{ text: <Row number={13} text={it.L('Cryptocurrency trading')} />}, { text: it.L('24/7') },                   { text: it.L('24/7') },                   { text: it.L('N/A') }],
                    ],
                }}
            />
        </div>

        <div className='gr-padding-10' />

        <FootNote
            number={1}
            title={it.L('Account currency')}
            texts={[it.L('Currency of the funds accepted in your trading account.')]}
        />
        <FootNote
            number={2}
            title={it.L('Leverage')}
            texts={[it.L('Leverage gives you the ability to trade a larger position using your existing capital.')]}
        />
        <FootNote
            number={3}
            title={it.L('Order execution')}
            texts={[
                it.L('Order execution typically comes in two varieties: market execution and instant execution. With market execution, you will place an order at the broker’s price. You agree on the price in advance. There are no requotes with market execution.'),
                it.L('What about instant execution? In this case, your order is placed at the price that’s available at that time. Requotes are possible if the price fluctuates a great deal before the order execution is complete.'),
            ]}
        />
        <FootNote
            number={4}
            title={it.L('Spread')}
            texts={[it.L('The spread is the difference between the buy price and sell price. A fixed spread means that the spread will remain as it is no matter the market condition except in rare cases of extreme market volatility. A variable spread means that the spread is constantly changing, depending on the market condition.')]}
        />
        <FootNote
            number={5}
            title={it.L('Commission')}
            texts={[it.L('Most brokers typically charge a commission for each trade that you place. [_1] currently charges no commission across all account types, except for cryptocurrencies.', it.website_name)]}
        />
        <FootNote
            number={6}
            title={it.L('Minimum deposit')}
            texts={[it.L('Most brokers require a minimum deposit. [_1] doesn\'t require any minimum deposit.', it.website_name)]}
        />
        <FootNote
            number={7}
            title={it.L('Margin call')}
            texts={[it.L('When the remaining funds in your account is unable to cover the leverage or margin requirement, your account will be placed under margin call. To prevent a margin call escalating into a stop out level, you can deposit additional funds into your account or close any open positions.')]}
        />
        <FootNote
            number={8}
            title={it.L('Stop out level')}
            texts={[it.L('If your account is placed under margin call for an extended period of time, it will reach the stop out level where it is unable to sustain an open position. This will lead to your pending orders being cancelled and your open positions being forcibly closed (also known as “forced liquidation”).')]}
        />
        <FootNote
            number={9}
            title={it.L('Number of assets')}
            texts={[it.L('Refers to the total number of available symbols for your account.')]}
        />
        <FootNote
            number={10}
            title={it.L('Maximum ticket size')}
            texts={[it.L('Refers to the maximum volume or lots per order.')]}
        />
        <FootNote
            number={11}
            title={it.L('Minimum ticket size')}
            texts={[it.L('The minimum ticket size refers to the minimum volume or number of lots.')]}
        />
        <FootNote
            number={12}
            title={it.L('Step size')}
            texts={[it.L('Step size is the minimum allowable increment applied to all order types. It is the volume from which the increase of the position is based. You can only trade in the minimum ticket size or its multiples.')]}
        />
        <FootNote
            number={13}
            title={it.L('Cryptocurrency trading')}
            texts={[it.L('Indicates the availability of cryptocurrency trading on a particular account.')]}
        />
    </div>
);

export default TypesOfAccounts;
