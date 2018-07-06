import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';
import { FillBox } from '../../_common/components/elements.jsx';

let id_no;

const Steps = ({ step, image, text }) => (
    <div className='gr-6 gr-12-m gr-padding-30'>
        <div className='gr-row align-center'>
            <img className='small-image' src={it.url_for(`images/pages/home-jp/${step}.svg`)} />
            <img className='medium-image' src={it.url_for(`images/pages/home-jp/${image}.svg`)} />
            <p className='gr-6 gr-no-gutter'>{text}</p>
        </div>
    </div>
);

const Product = ({
    className,
    icon_1,
    icon_2,
    header,
    description,
    image_1,
    image_2,
    duration,
}) => {
    id_no += 1;

    return (
        <li id={`product_${id_no}`} className={`product product_${className}`}>
            <div className='gr-row gr-row-align-center mb-trading-wrapper' id='mb_trading'>
                <div className={`${icon_1} contract-type`} />
                <div className={`${icon_2} negative-color contract-type`} />
            </div>
            <h3 className='center-text gr-padding-10'>{header}</h3>
            <p>{description}</p>
            <div className='gr-row gr-row-align-center'>
                <div className='gr-4 gr-12-m'>
                    <img className='responsive' src={it.url_for(`images/pages/trade-explanation/ja/${image_1}.svg`)} />
                </div>
                <div className='gr-12-m gr-padding-10' />
                <div className='gr-4 gr-12-m'>
                    <img className='responsive' src={it.url_for(`images/pages/trade-explanation/ja/${image_2}.svg`)} />
                </div>
            </div>
            <p>{duration}</p>
        </li>
    );
};

const Home = () => {
    id_no = 0;

    return (
        <React.Fragment>
            <div className='relative'>
                <div id='banner' />
                <div className='container gr-padding-30'>
                    <div className='gr-padding-30'>
                        <h1 className='center-text gr-padding-20'>{it.L('{JAPAN ONLY}First-Class FX Binary Options Trading Platform')}</h1>
                        <h3 className='center-text gr-padding-20 gr-child'>{it.L('{JAPAN ONLY}Offering the widest available range of currencies, option types and trading periods on a fast intuitive, proprietary trading platform.')}</h3>
                    </div>
                </div>

                <div className='container gr-padding-10 gr-child'>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-p gr-12-m'>
                            <div className='gr-7 gr-8-m gr-centered gr-padding-30 gr-child'>
                                <div className='gr-row'>
                                    <a
                                        href='http://www.fsa.go.jp/index.html'
                                        target='_blank'
                                        className='gr-4 gr-no-gutter'
                                        rel='noopener noreferrer'
                                    >
                                        <img className='responsive' src={it.url_for('images/pages/regulation/fsa-logo.png')} />
                                    </a>
                                    <a
                                        href='http://www.ffaj.or.jp/index.html'
                                        target='_blank'
                                        className='gr-8 gr-no-gutter'
                                        rel='noopener noreferrer'
                                    >
                                        <img className='responsive' src={it.url_for('images/pages/regulation/binarykk-logo.gif')} />
                                    </a>
                                </div>
                                <div className='gr-padding-20 gr-child'>
                                    <h3>{it.L('{JAPAN ONLY}Licensed in Japan')}</h3>
                                    <p>{it.L('{JAPAN ONLY}Binary KK is a licensed Type 1 Financial Instruments Business, regulated by the KLFB, and a member of the FFAJ.')}</p>
                                </div>
                            </div>
                        </div>

                        <div className='gr-6 gr-12-p gr-12-m'>
                            <div className='gr-7 gr-8-m gr-centered gr-padding-30 gr-child'>
                                <div className='gr-8 gr-no-gutter'>
                                    <a href='https://www.jsftb.co.jp/' target='_blank' rel='noopener noreferrer'>
                                        <img className='responsive' src={it.url_for('images/pages/home-jp/JSF.png')} />
                                    </a>
                                </div>
                                <div className='gr-padding-20 gr-child'>
                                    <h3>{it.L('{JAPAN ONLY}Segregated Funds')}</h3>
                                    <p>{it.L('{JAPAN ONLY}All customer funds are segregated and held with JSF Trust Bank.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SeparatorLine no_wrapper />
                </div>
            </div>

            <div className='container gr-padding-10'>
                <h2 className='center-text gr-padding-10'>{it.L('{JAPAN ONLY}A leading innovator of Binary Options trading for over 15 Years')}</h2>
                <div className='gr-row'>
                    <FillBox
                        className='box'
                        padding='5'
                        center
                        align_left
                        text={it.L('{JAPAN ONLY}Trade the world’s major currencies with a wide range options and trading periods. More than any other Japan broker!')}
                    />

                    <div className='gr-5 gr-centered gr-6-p gr-8-m gr-padding-30'>
                        <img className='gr-11 gr-12-p gr-12-m gr-centered' src={it.url_for('images/pages/home-jp/currencies.svg')} />
                    </div>
                </div>

                <div className='gr-padding-30 center-text'>
                    <a className='button' href={it.url_for('multi_barriers_trading')}>
                        <span>{it.L('{JAPAN ONLY}Try our trading page')}</span>
                    </a>
                </div>
                <SeparatorLine no_wrapper />
            </div>

            <div className='container gr-padding-10 center-text'>
                <div className='gr-row gr-row-align-center'>
                    <div className='align-self-center gr-gutter-right'>
                        <img className='go-left disabled' src={it.url_for('images/pages/home-jp/icons/left_disabled.svg')} />
                    </div>
                    <div className='no-scroll'>
                        <ul id='product_wrapper'>
                            <Product
                                icon_1='PUT'
                                icon_2='CALLE'
                                className='visible'
                                image_1='higher'
                                image_2='lower'
                                header={it.L('{JAPANY ONLY}Ladder Options')}
                                description={it.L('{JAPANY ONLY}Predict whether a FX rate will finish higher or lower than a target barrier.')}
                                duration={it.L('{JAPANY ONLY}2 hours to 1 year terms')}
                            />
                            <Product
                                icon_1='ONETOUCH'
                                icon_2='NOTOUCH'
                                className='hidden'
                                image_1='touch'
                                image_2='no-touch'
                                header={it.L('{JAPANY ONLY}Touch Options')}
                                description={it.L('{JAPANY ONLY}Predict whether a FX rate will touch a target barrier or not.')}
                                duration={it.L('{JAPANY ONLY}1 week to 1 year terms')}
                            />
                            <Product
                                icon_1='EXPIRYRANGEE'
                                icon_2='EXPIRYMISS'
                                className='hidden'
                                image_1='ends-between'
                                image_2='ends-outside'
                                header={it.L('{JAPANY ONLY}Range Options: End-In / End-Out')}
                                description={it.L('{JAPANY ONLY}Predict whether a FX rate will end inside or outside a certain range.')}
                                duration={it.L('{JAPANY ONLY}1 week to 1 year terms')}
                            />
                            <Product
                                icon_1='RANGE'
                                icon_2='UPORDOWN'
                                className='hidden'
                                image_1='stays-between'
                                image_2='goes-outside'
                                header={it.L('{JAPANY ONLY}Range Options: Stay-In / Break-Out')}
                                description={it.L('{JAPANY ONLY}Predict whether a FX rate will touch either target barrier before expiry.')}
                                duration={it.L('{JAPANY ONLY}1 week to 1 year terms')}
                            />
                        </ul>
                    </div>
                    <div className='align-self-center gr-gutter-left'>
                        <img className='go-right' src={it.url_for('images/pages/home-jp/icons/right_enabled.svg')} />
                    </div>
                </div>
            </div>

            <div className='gr-padding-30 fill-bg-color'>
                <div className='container'>
                    <h2 className='center-text gr-padding-10'>{it.L('{JAPAN ONLY}How to begin')}</h2>

                    <div className='gr-11 gr-centered'>
                        <div className='gr-row'>
                            <Steps step='1' image='demo' text={it.L('{JAPAN ONLY}Open a Demo Account')} />
                            <Steps step='2' image='personal_info' text={it.L('{JAPAN ONLY}Input personal information')} />
                        </div>

                        <div className='gr-row'>
                            <Steps step='3' image='test' text={it.L('{JAPAN ONLY}Pass our Knowledge Test')} />
                            <Steps step='4' image='email' text={it.L('{JAPAN ONLY}Email us your Identity Documents')} />
                        </div>

                        <div className='gr-row'>
                            <Steps step='5' image='secure' text={it.L('{JAPAN ONLY}Receive your activation code by secure')} />
                            <Steps step='6' image='fund' text={it.L('{JAPAN ONLY}Deposit funds and begin trading')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='container gr-padding-30 center-text'>
                <h2 className='gr-padding-10'>{it.L('{JAPAN ONLY}FX Bloggers, Mentors & Gurus')}</h2>
                <p>{it.L('{JAPAN ONLY}Join our affiliate program to earn income by leveraging your hard-earned network of contact')}</p>
                <div className='gr-padding-30'>
                    <a className='button' href={it.url_for('affiliate/signup-jp')}>
                        <span>{it.L('{JAPAN ONLY}Join now')}</span>
                    </a>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;
