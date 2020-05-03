import React from 'react';

const DMT5Banner = () => (
    <div className='dmt5_banner'>
        <img className='dmt5_banner__background dmt5_banner__background--desktop' src={it.url_for('images/dmt5_banner/dmt5_banner_bg.png')} />
        <img className='dmt5_banner__background dmt5_banner__background--mobile' src={it.url_for('images/dmt5_banner/dmt5_banner_bg_mobile.png')} />
        <h3 className='dmt5_banner__content'>{it.L('Binary.com MT5 is moving to Deriv')}</h3>
        <img className='dmt5_banner__platform' src={it.url_for('images/dmt5_banner/dmt5_platform.png')} />
        <img className='dmt5_banner__platform_mobile' src={it.url_for('images/dmt5_banner/dmt5_platform_mobile.png')} />
        <div className='dmt5_banner__learn_more'>{it.L('Learn more')}</div>
    </div>
);

export default DMT5Banner;
