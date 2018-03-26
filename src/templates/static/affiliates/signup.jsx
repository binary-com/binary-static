import React from 'react';
import { TabContainer, TabContent, TabContentContainer, TabsSubtabs } from '../../_common/components/tabs.jsx';

const BoxRow = ({ children, top_row, bottom_row }) => (
    <div className={`box-row gr-row ${top_row ? 'box-row-top' : ''} ${bottom_row ? 'box-row-bottom' : ''}`}>
        {children}
    </div>
);

const Box = ({ image, title, text }) => (
    <div className='box gr-4 gr-12-m center-text gr-padding-30'>
        <img className='gr-centered fixed-height-img' src={it.url_for(`images/pages/affiliates/${image}.svg`)} alt={image} />
        <p><strong>{title}</strong></p>
        <p>{text}</p>
    </div>
);

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

// TODO: add lang to href ?
export const signup_url = 'https://login.binary.com/signup.php';

const Signup = () => (
    <div className='static_full affiliates'>
        <div className='container'>
            <h1>{it.L('Binary.com Affiliate Programme')}</h1>
            <p>
                {it.L('Earn up to 35% commission with an award-winning binary options trading platform.')}
            </p>

            <div className='gr-padding-20'>
                <h2 className='center-text margin-bottom-50'>{it.L('How it works')}</h2>
                <div className='steps'>
                    <Step circle_no='1' header={it.L('Sign up')}            text={it.L('Getting started is free and easy –– just <a href=\'[_1]\'>fill out the application form</a> and wait for our approval.', signup_url)} />
                    <Step circle_no='2' header={it.L('Promote Binary.com')} text={it.L('Use your unique affiliate link and the marketing tools we provide to advertise Binary.com to your audience.')} />
                    <Step circle_no='3' header={it.L('Earn')}               text={it.L('Choose from two types of  commission plans when your referred clients trade binary options on our platform.')} />
                </div>
            </div>
        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-20'>
                <h2 className='margin-bottom-50'>{it.L('Why you should join the Binary.com Affiliate Programme')}</h2>

                <BoxRow top_row>
                    <Box title={it.L('Generous commission')}      image='commission-icon'       text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <Box title={it.L('On-time payments')}         image='payment-icon'          text={it.L('Get paid by the 15th of every month. We’ve never missed a payment since we started our programme in March 2004.')} />
                    <Box title={it.L('Dedicated support')}        image='contact-icon'          text={it.L('Contact our dedicated affiliate support team for help and suggestions.')} />
                </BoxRow>
                <BoxRow bottom_row>
                    <Box title={it.L('Advanced marketing tools')} image='marketing-icon'        text={it.L('Promote our products easily, and keep track of all your earnings with our nifty marketing tools.')} />
                    <Box title={it.L('High conversions')}         image='conversion-icon'       text={it.L('We’ve paid millions in commission to date through our industry-leading affiliate programme.')} />
                    <Box title={it.L('Multiple opportunities')}   image='diversify-income-icon' text={it.L('Diversify your income stream through other partnership opportunities such as the <a href=\'[_1]\'>Payment Agent Programme</a>.', it.url_for('payment-agent'))} />
                </BoxRow>

                <div className='gr-padding-30'>
                    <a className='button' href={signup_url}>
                        <span>{it.L('Apply Now')}</span>
                    </a>
                </div>
            </div>
        </div>

        <div className='container gr-padding-20'>
            <div className='center-text'>
                <h2>{it.L('Types of affiliate commission plans')}</h2>
                <p>{it.L('You can choose from two types of affiliate commission plans:')}</p>
            </div>
    
            <TabContainer className='gr-padding-20 full-width' theme='light'>
                <TabsSubtabs
                    id='commission_tabs'
                    className='gr-parent tab-selector-wrapper'
                    items={[
                        { id: 'revenue_share',   text: it.L('Revenue share') },
                        { id: 'turnover',        text: it.L('Turnover') },
                        { id: 'commission_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='revenue_share'>
                            <p>{it.L('Profit from increasingly higher payouts with tiered and laddered commision rates that reward you based on the net revenue generated by your referred clients.')}</p>
                            <div className='gr-padding-20 center-text'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{it.L('Tier')}</th>
                                            <th>{it.L('Total net revenue per month (USD)')}</th>
                                            <th>{it.L('Commission rates')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{'1'}</td>
                                            <td>{'$0 – $10,000'}</td>
                                            <td>{'20%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'2'}</td>
                                            <td>{'$10,001 – $50,000'}</td>
                                            <td>{'25%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'3'}</td>
                                            <td>{'$50,001 – $100,000'}</td>
                                            <td>{'30%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'4'}</td>
                                            <td>{it.L('$100,001 and above')}</td>
                                            <td>{'35%'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>{it.L('All commissions are credited into your account by the 15th of every month.')}</p>
                        </TabContent>
                        <TabContent id='turnover'>
                            <p>{it.L('Our turnover-based commission plan depends on the probability of returns for each contract. Contracts with higher returns for the client offer lower commissions to the affiliate.')}</p>
                            <div className='gr-padding-20 center-text'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{it.L('Probability of returns')}</th>
                                            <th>{it.L('Commission (as % of stake)')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{'0 – 19.999%'}</td>
                                            <td>{'1.25%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'20 – 39.999%'}</td>
                                            <td>{'1%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'40 – 59.999%'}</td>
                                            <td>{'0.75%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'60 – 79.999%'}</td>
                                            <td>{'0.5%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'80 – 94.999%'}</td>
                                            <td>{'0.25%'}</td>
                                        </tr>
                                        <tr>
                                            <td>{'95%+'}</td>
                                            <td>{'0%'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>{it.L('All commissions are credited into your account by the 15th of every month.')}</p>
                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>

        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-30'>
                <p>{it.L('Sign up for the Binary.com Affiliate Programme today:')}</p>
                <p>
                    <a className='button' href={signup_url}>
                        <span>{it.L('Yes, I Want To Sign Up As An Affiliate')}</span>
                    </a>
                </p>
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
