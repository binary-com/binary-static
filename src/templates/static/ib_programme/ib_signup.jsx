import React from 'react';
import { Table } from '../../_common/components/elements.jsx';
import { TabContainer, TabContent, TabContentContainer, TabsSubtabs } from '../../_common/components/tabs.jsx';
import { BoxRow, Box } from '../affiliates/signup.jsx';

const Step = ({ header, text, circle_no }) => (
    <div className='step'>
        <div className='border-bottom' />
        <div className='circle'>{ circle_no }</div>
        <div className='gr-padding-20 gr-gutter center-text'>
            <div className='gr-padding-20 gr-child'><strong>{header}</strong></div>
            <p className='no-margin gr-padding-10'>{text}</p>
        </div>
    </div>
);

const Signup = () => (
    <div className='static_full ib-programme signup-page'>
        <div className='container'>
            <h1>{it.L('[_1] Introducing Broker (IB) Programme', it.website_name)}</h1>
            <p>
                {it.L('Earn commission on the trading activity of clients that you refer to our MetaTrader 5 platform.')}
            </p>

            <div className='gr-padding-20 center-text'>
                <h2 className='margin-bottom-50'>{it.L('How it works')}</h2>
                <div className='steps'>
                    <Step circle_no='1' header={it.L('Sign up')}                       text={it.L('Getting started is free and easy. Just [_1]fill out the application form[_2]* and wait for our approval.', `<a href='${it.affiliate_signup_url}'>`, '</a>')} />
                    <Step circle_no='2' header={it.L('Promote [_1]', it.website_name)} text={it.L('Use your unique affiliate link and the marketing tools we provide to advertise our MT5 service to your audience.')} />
                    <Step circle_no='3' header={it.L('Earn')}                          text={it.L('Earn a commission when your referred clients trade Forex and CFDs on our MT5 platform.')} />
                </div>
                <p>{it.L('*Already registered as an affiliate? Send us an email at [_1] instead.', `<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>
            </div>
        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-20'>
                <h2 className='margin-bottom-50'>{it.L('Why you should join the [_1] IB Programme', it.website_name)}</h2>

                <BoxRow no_border>
                    <Box title={it.L('Daily payouts')}            image='payment-icon'   text={it.L('Get your IB commission credited daily into your MT5 account.')} />
                    <Box title={it.L('Advanced marketing tools')} image='marketing-icon' text={it.L('Track every click, impression, download, and signup to increase your conversions.')} />
                    <Box title={it.L('Dedicated support')}        image='contact-icon'   text={it.L('Contact our dedicated affiliate support team for help and suggestions.')} />
                </BoxRow>

            </div>
        </div>

        <div className='container gr-padding-20'>
            <h2 className='center-text'>{it.L('Commission structure')}</h2>
            <div className='gr-padding-20 center-text'>
                <Table
                    data={{
                        thead: [
                            [
                                { text: '' },
                                { text: it.L('Accounts/Assets') },
                                { text: it.L('Commission rates') },
                            ],
                        ],
                        tbody: [
                            [
                                { text: it.L('Forex & Metals*'), attributes: { rowSpan: 2 } },
                                { text: it.L('Standard') },
                                { text: it.L('6 per lot') },
                            ],
                            [
                                { text: it.L('Advanced') },
                                { text: it.L('2 per lot') },
                            ],
                            [
                                { text: it.L('Volatility Indices**'), attributes: { rowSpan: 8 } },
                                { text: it.L('Vol 10') },
                                { text: it.L('0.25 per lot') },
                            ],
                            [
                                { text: it.L('Vol 25') },
                                { text: it.L('0.1 per lot') },
                            ],
                            [
                                { text: it.L('Vol 50') },
                                { text: it.L('0.1 per lot') },
                            ],
                            [
                                { text: it.L('Vol 75') },
                                { text: it.L('2.25 per lot') },
                            ],
                            [
                                { text: it.L('Vol 100') },
                                { text: it.L('0.75 per lot') },
                            ],
                            [
                                { text: it.L('HF Vol 10') },
                                { text: it.L('0.25 per lot') },
                            ],
                            [
                                { text: it.L('HF Vol 50') },
                                { text: it.L('0.1 per lot') },
                            ],
                            [
                                { text: it.L('HF Vol 100') },
                                { text: it.L('0.1 per lot') },
                            ],
                        ],
                    }}
                />
            </div>
            <p>{it.L('*Represents the amount in base currency per round trade. Example: A buy of 1 lot of EUR/USD would pay EUR 6 on standard accounts.')}</p>
            <p>{it.L('**Volatility Indices commission rates in account currency per round trade. Example: A buy of 1 lot of Volatility 100 Index would pay USD 0.75 for a USD denominated account.')}</p>
            <div className='gr-padding-20 center-text'>
                <a className='button' href={it.affiliate_signup_url}>
                    <span>{it.L('Apply Now')}</span>
                </a>
            </div>
        </div>

        <div className='container gr-padding-20'>
            <h2 className='center-text'>{it.L('FAQ')}</h2>

            <div className='gr-row'>
                <a href={`${it.url_for('affiliate/faq')}#general`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/general-faq-icon.svg')} alt='general-faq-icon' />
                    <p><strong>{it.L('General')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#account-management-and-tracking`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/account-icon.svg')} alt='account-icon' />
                    <p><strong>{it.L('Account management and tracking')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#marketing-and-promotions`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/marketing-icon.svg')} alt='marketing-icon' />
                    <p><strong>{it.L('Marketing and promotions')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#support`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/support-faq-icon.svg')} alt='support-faq-icon' />
                    <p><strong>{it.L('Support')}</strong></p>
                </a>
            </div>
        </div>
    </div>
);

export default Signup;
