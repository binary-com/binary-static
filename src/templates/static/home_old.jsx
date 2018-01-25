import React from 'react';
import FormVerifyEmail from '../_common/includes/form_verify_email.jsx';
import SeparatorLine from '../_common/components/separator_line.jsx';
import { List, FillBox } from '../_common/components/elements.jsx';


const PaymentLogo = ({ items }) => items.map((item, idx) => (
    <div key={idx} className='payment-logo' id={item}></div>
));

const Home = () => (
    <React.Fragment>
        <div id='banner'>
            <div className='container gr-padding-30'>
                <h1 className='dark center-text gr-padding-10'>{it.L('The <strong>Premier Platform</strong> for Binary Options Trading')}</h1>
                <p className='center-text gr-padding-10'>{it.L('Trade <strong>24/7</strong>, even on weekends.')}</p>

                <FormVerifyEmail className='secondary-bg-color' text={it.L('Create Free Account')} dark_button />
            </div>
        </div>

        <div className='container'>
            <div className='gr-parent'>
                <h2 className='center-text gr-padding-10'>{it.L('The easiest way to get started in the financial markets')}</h2>
                <p className='center-text'>{it.L('Trade in the world\'s financial markets in a simple, user-friendly platform.')}</p>

                <div className='gr-row gr-row-align-middle'>
                    <div className='gr-7 gr-12-m gr-parent'>
                        <img className='responsive' src={it.url_for('images/pages/tour/trade-tutorial_1.svg')} />
                    </div>

                    <div className='gr-5 gr-12-m gr-parent'>
                        <List
                            items={[
                                { header: it.L('All markets:'),           text: it.L('currencies, stocks, indices, and commodities.') },
                                { header: it.L('All market conditions:'), text: it.L('up/down, touch/no-touch, stays between/goes outside.') },
                                { header: it.L('All durations:'),         text: it.L('from 10 seconds to 365 days.') },
                                { header: it.L('All payouts:'),           text: it.L('from $1 to $50,000.') },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className='gr-padding-10 fill-bg-color'>
            <div className='container gr-padding-20'>
                <h2 className='center-text'>{ it.L('Why choose us') }</h2>
                <div className='center-text'>
                    <p>{ it.L('[_1] is the award-winning industry pioneer in online options trading.', it.website_name)}</p>

                    <div className='gr-3 gr-8-m gr-centered'>
                        <img className='responsive' src={it.url_for('images/pages/home/awards-opwa.svg')} />
                    </div>
                    <div className='gr-padding-10'>
                        <img className='small-image' src={it.url_for('images/pages/home/awards-t2w.png')} />
                        <img className='small-image' src={it.url_for('images/pages/why-us/why-us-GBAF-award-2012.svg')} />
                        <img className='small-image' src={it.url_for('images/pages/home/awards-egr.png')} />
                        <img className='mena' src={it.url_for('images/pages/home/awards-mena.png')} />
                    </div>

                    <List
                        className='gr-row gr-row-align-center'
                        items={[
                            { header: it.L('Sharp prices'),           className: 'xlist1' },
                            { header: it.L('Trade your way'),         className: 'xlist3' },
                            { header: it.L('Licensed and regulated'), className: 'xlist2' },
                        ]}
                    />
                </div>
            </div>
        </div>

        <div className='container gr-padding-30'>
            <h2 className='center-text'>{it.L('[_1] academy', it.website_name)}</h2>

            <div className='gr-12 gr-6-p center-text gr-centered'>
                <p>{it.L('Improve your trading skills with our free educational & training resources.')}</p>
            </div>

            <div className='gr-row gr-row-align-center'>
                <div className='gr-3 gr-12-m gr-6-p'><img className='responsive' src={it.url_for('images/pages/home/academy-icon.svg')} /></div>
                <div className='gr-4 gr-12-m gr-6-p'>
                    <ul className='checked'>
                        <li>{it.L('Free webinars')}</li>
                        <li>{it.L('Free daily market report')}</li>
                        <li>{it.L('Free E-books')}</li>
                        <li>{it.L('Free trading charts')}</li>
                    </ul>
                </div>
            </div>

            <div className='gr-12 gr-6-p gr-centered'>
                <div className='gr-row gr-row-align-center gr-padding-10'>
                    <a className='button' href='https://academy.binary.com' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Start learning')}</span>
                    </a>
                </div>
            </div>

            <SeparatorLine no_wrapper />
        </div>

        <div className='container gr-padding-30 gr-parent'>
            <h2 className='center-text'>{it.L('What our clients are saying')}</h2>

            <div className='gr-row'>
                <FillBox
                    padding = '6'
                    align_left
                    em
                    text = {it.L('"We have used www.binary.com for the last 8 years and highly recommend binary to all our members worldwide."')}
                >
                    <div className='xbubble-left'></div>
                    <div className='xquoter-left'><p>{it.L('Joshua Cavallaro <span> Markets And You Trader</span>')}</p></div>
                </FillBox>
                <FillBox
                    padding = '6'
                    em
                    align_left
                    text = {it.L('"[_1] is one of the oldest and trustworthy partners we ever had. We have worked together for many years."', it.website_name)}
                >
                    <div className='xbubble-right'></div>
                    <div className='xquoter-right'><p>{it.L('Andrei Asavei <span>Top Binary Options Brokers</span>')}</p></div>
                </FillBox>
            </div>

            <SeparatorLine no_wrapper />
        </div>

        <div className='container' id='payment_methods'>
            <div className='gr-12 gr-padding-30 gr-parent'>
                <h2 className='center-text'>{it.L('Payment methods')}</h2>

                <div className='gr-12'>
                    <a href={it.url_for('cashier/payment_methods')}>
                        <div className='gr-row gr-row-align-center'>
                            <PaymentLogo
                                items ={[
                                    'visa',
                                    'mastercard',
                                    'int_bank_wire',
                                    'local_bank_transfer',
                                    'neteller',
                                    'okpay',
                                    'fastpay',
                                    'perfect_money',
                                    'moneybrokers',
                                ]}
                            />
                        </div>
                    </a>
                    <p className='center-text'>{it.L('Hundreds of deposit and withdrawal options.')}</p>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Home;
