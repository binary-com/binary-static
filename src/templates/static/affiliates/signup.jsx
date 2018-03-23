import React from 'react';
import FAQ from './faq.jsx';
import Main from './main.jsx';

const Step = ({ header, text, circle_no }) => {
    return (
        <div className='step'>
            <div className='border-bottom' />
            <div className='circle'>{ circle_no }</div>
            <div className='gr-padding-20 gr-gutter center-text'>
                <div className='gr-padding-20 gr-child'><strong>{header}</strong></div>
                <p className='no-margin gr-padding-10'>{text}</p>
            </div>
        </div>
    );
};

const Signup = () => (
    <div>
        <h1>{it.L('Binary.com Affiliate Programme')}</h1>
        <p>
            {it.L('Earn up to 35% commission with an award-winning binary options trading platform.')}
        </p>

        <h2>{it.L('How it works')}</h2>
        <div className='steps'>
            {/* TODO: add link in first step */}
            <Step circle_no='1' header={it.L('Sign up')}            text={it.L('Getting started is free and easy –– just fill out the application form and wait for our approval.')} />
            <Step circle_no='2' header={it.L('Promote Binary.com')} text={it.L('Use your unique affiliate link and the marketing tools we provide to advertise Binary.com to your audience.')} />
            <Step circle_no='3' header={it.L('Earn')}               text={it.L('Choose from two types of  commission plans when your referred clients trade binary options on our platform.')} />
        </div>
    </div>
);

export default Signup;
