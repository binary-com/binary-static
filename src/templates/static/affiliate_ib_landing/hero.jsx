import React from 'react';

const Hero = () => (
    <section className='hero'>
        <div className='container gr-row gr-padding-20 full-height align-self-center center-text'>
            <div className='gr-10 gr-centered'>
                <h2 className='hero-header color-white'>{it.L('Build a rewarding and long-term business relationship with an industry pioneer')}</h2>
                <a href={it.affiliate_signup_url} className='button' target='_blank' rel='noopener noreferrer'>
                    <span>{it.L('Become our partner')}</span>
                </a>
            </div>
        </div>
    </section>
);

export default Hero;
