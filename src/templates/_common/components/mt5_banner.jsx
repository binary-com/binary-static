import React from 'react';

const mt5Banner = () => (
    <a className='mt5_banner' data-show='-eucountry' target='_blank' rel='noopener noreferrer' href='https://deriv.com/interim/dmt5/?utm_source=binary&utm_medium=referral&utm_campaign=deriv-launch&utm_content=binary-mt5-page'>
        <img className='mt5_banner__background mt5_banner__background--desktop' src={it.url_for('images/mt5_banner/mt5_banner_bg.png')} />
        <img className='mt5_banner__background mt5_banner__background--mobile' src={it.url_for('images/mt5_banner/mt5_banner_bg_mobile.png')} />
        <h3 className='mt5_banner__content'>{it.L('Binary.com MT5 is moving to Deriv')}</h3>
        <img className='mt5_banner__platform' src={it.url_for('images/mt5_banner/mt5_platform.png')} />
        <img className='mt5_banner__platform_mobile' src={it.url_for('images/mt5_banner/mt5_platform_mobile.png')} />
        <div className='mt5_banner__learn_more'>{it.L('Learn more')}</div>
    </a>
);

export default mt5Banner;
