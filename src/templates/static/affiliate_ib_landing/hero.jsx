import React from 'react';

const Hero = () => (
    <section id='hero' className='gr-row'>
        <div className='gr-8 gr-10-m gr-12-p gr-centered align-self-center center-text'>
            <h2>{it.L('Build a rewarding and long-term business relationship with an industry pioneer')}</h2>
            <a className='button' href={it.affiliate_signup_url} target='_blank' rel='noopener noreferrer'>
                <span>{it.L('Become our partner')}</span>
            </a>
        </div>
    </section>
);

export default Hero;
