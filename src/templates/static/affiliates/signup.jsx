import React from 'react';
import FAQ from './faq.jsx';
import Main from './main.jsx';

// TODO: compress svgs

const BoxRow = ({ children, className = '' }) => (
    <div className={`box-row gr-row ${className}`}>
        {children}
    </div>
);

const Box = ({ image, title, text }) => (
    <div className='box gr-4 gr-12-m center-text gr-padding-30'>
        <img className='gr-4 gr-centered' src={it.url_for(`images/pages/affiliates/${image}.svg`)} />
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
const signup_url = 'https://login.binary.com/signup.php';

const Signup = () => (
    <div className='static_full'>
        <div className='container'>
            <h1>{it.L('Binary.com Affiliate Programme')}</h1>
            <p>
                {it.L('Earn up to 35% commission with an award-winning binary options trading platform.')}
            </p>

            <h2 className='center-text gr-padding-30'>{it.L('How it works')}</h2>
            <div className='steps'>
                {/* TODO: add link in first step */}
                <Step circle_no='1' header={it.L('Sign up')}            text={it.L('Getting started is free and easy –– just fill out the application form and wait for our approval.')} />
                <Step circle_no='2' header={it.L('Promote Binary.com')} text={it.L('Use your unique affiliate link and the marketing tools we provide to advertise Binary.com to your audience.')} />
                <Step circle_no='3' header={it.L('Earn')}               text={it.L('Choose from two types of  commission plans when your referred clients trade binary options on our platform.')} />
            </div>
        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-30'>
                <h2>{it.L('Why you should join the Binary.com Affiliate Programme')}</h2>

                {/* TODO: add box grid */}
                <BoxRow className='border-bottom'>
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                </BoxRow>
                <BoxRow>
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <Box title={it.L('Generous commission')} image='commission-icon' text={it.L('Choose a commission plan that suits your business strategy.')} />
                </BoxRow>

                <a className='button' href={signup_url}>
                    <span>{it.L('Apply Now')}</span>
                </a>
            </div>
        </div>

        <div className='container center-text gr-padding-30'>
            <h2 className='center-text'>{it.L('Types of affiliate commission plans')}</h2>
            <p>{it.L('You can choose from two types of affiliate commission plans:')}</p>

            {/* TODO: add tabs */}
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

        <div className='container'>
            <h2 className='center-text'>{it.L('FAQ')}</h2>
        </div>
    </div>
);

export default Signup;
