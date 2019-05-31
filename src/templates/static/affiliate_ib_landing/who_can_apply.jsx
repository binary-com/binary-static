import React from 'react';

const WhoCanApply = () => (
    <section className='who-apply'>
        <div className='container gr-padding-20 white-bg-color'>
            <h2 className='center-text'>{it.L('Who can apply as a [_1] partner', it.website_name)}</h2>
            <div className='gr-row center-text-m'>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Webmaster')}</h4>
                    <p>{it.L('Runs and manages a website that promotes forex or binary options')}</p>
                </div>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Trading guru')}</h4>
                    <p>{it.L('Nurtures a community of potential and existing online traders through insight and mentorship')}</p>
                </div>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Webinar speaker')}</h4>
                    <p>{it.L('Conducts trading discussions and interactive sessions online with trading enthusiasts')}</p>
                </div>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Web and software developer')}</h4>
                    <p>{it.L('Builds trading applications and interfaces using the [_1] API', it.website_name)}</p>
                </div>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Social media admin')}</h4>
                    <p>{it.L('Manages a social media page dedicated to online trading')}</p>
                </div>
                <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
                    <h4>{it.L('Blogger and vlogger')}</h4>
                    <p>{it.L('Maintains a page or video channel about online trading')}</p>
                </div>
                <a href={it.affiliate_signup_url} className='button gr-centered gr-10-m gr-padding-20' target='_blank' rel='noopener noreferrer'>
                    <span>{it.L('Join our global network of partners now')}</span>
                </a>
            </div>
        </div>
    </section>
);

export default WhoCanApply;
