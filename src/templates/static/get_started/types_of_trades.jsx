import React from 'react';

const TypesOfTrades = () => (
    <React.Fragment>
        <div className='section-content section-2'>
            <div>
                <h1>{it.L('Types of trades')}</h1>
                <p>{it.L('[_1] offers five main types of trades that will help you execute your market view or strategy:', it.website_name)}</p>
                <ul className='bullet'>
                    <li>{it.L('Up/Down')}</li>
                    <li>{it.L('Touch/No Touch')}</li>
                    <li>{it.L('In/Out')}</li>
                    <li>{it.L('Asians')}</li>
                    <li>{it.L('Digits')}</li>
                </ul>
            </div>

            <div className='subsection'>
                <h2><a href={it.url_for('trading?market=forex&formname=risefall')}>{it.L('Up/Down')}</a></h2>
                <p>{it.L('There are two types of Up/Down trades:')}</p>
                <ol>
                    <li>{it.L('Rise/Fall – Predict that the market will rise or fall from its current level')}</li>
                    <li>{it.L('Higher/Lower – Predict that the market will end higher or lower than a price target')}</li>
                </ol>
            </div>

            <div className='subsection'>
                <h2><a href={it.url_for('trading?market=forex&formname=touchnotouch')}>{it.L('Touch/No Touch')}</a></h2>
                <p>{it.L('Choose the Touch/No Touch trade if you want to predict the market touching or not touching a target any time during the contract period.')}</p>
            </div>

            <div className='subsection'>
                <h2><a href={it.url_for('trading?market=forex&formname=staysinout')}>{it.L('In/Out')}</a></h2>
                <p>{it.L('There are two types of In/Out trades:')}</p>
                <ol>
                    <li>{it.L('Stays Between/Goes Outside – Predict that the market stays inside or goes outside two price targets any time during the contract period')}</li>
                    <li>{it.L('Ends Between/Goes Outside – Predict that the market stops inside or outside two price targets at the end of the time period')}</li>
                </ol>
            </div>

            <div className='subsection'>
                <h2><a href={it.url_for('trading?market=volidx&formname=asian')}>{it.L('Asians')}</a></h2>
                <p>{it.L('There are two ways to trade Asians:')}</p>
                <ol>
                    <li>{it.L('Up - Predict that the market will end higher than the average price')}</li>
                    <li>{it.L('Down - Predict that the market will end lower than the average price')}</li>
                </ol>
            </div>

            <div className='subsection'>
                <h2><a href={it.url_for('trading?market=volidx&formname=matchdiff')}>{it.L('Digits')}</a></h2>
                <p>{it.L('Digits let you predict the last decimal digit of the spot price. There are three types of Digits trades:')}</p>
                <ol>
                    <li>{it.L('Matches/Differs - Predict that the last digit will match or not match')}</li>
                    <li>{it.L('Even/Odd - Predict that the last digit is even or odd after the last tick')}</li>
                    <li>{it.L('Over/Under - Predict that the last digit is higher or lower')}</li>
                </ol>
            </div>
        </div>
    </React.Fragment>
);

export default TypesOfTrades;
