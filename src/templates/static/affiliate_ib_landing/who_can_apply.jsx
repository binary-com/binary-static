import React from 'react';

const WhoCanApply = () => {
    const who_can_apply = [
        {
            title      : it.L('Webmaster'),
            description: it.L('Runs and manages a website that promotes forex or binary options'),
        },
        {
            title      : it.L('Trading guru'),
            description: it.L('Nurtures a community of potential and existing online traders through insight and mentorship'),
        },
        {
            title      : it.L('Webinar speaker'),
            description: it.L('Conducts trading discussions and interactive sessions online with trading enthusiasts'),
        },
        {
            title      : it.L('Web and software developer'),
            description: it.L('Builds trading applications and interfaces using the [_1] API', it.website_name),
        },
        {
            title      : it.L('Social media admin'),
            description: it.L('Manages a social media page dedicated to online trading'),
        },
        {
            title      : it.L('Blogger and vlogger'),
            description: it.L('Maintains a page or video channel about online trading'),
        },
    ];

    return (
        <section id='who-can-apply'>
            <div className='container'>
                <h2 className='center-text'>{it.L('Who can apply as a [_1] partner', it.website_name)}</h2>

                <div className='gr-row center-text-m'>
                    { who_can_apply.map((who, index) => (
                        <div key={index} className='gr-5 gr-12-m gr-padding-30 gr-centered gr-child'>
                            <h4>{ who.title }</h4>
                            <p>{ who.description }</p>
                        </div>
                    ))}

                    <a href={it.affiliate_signup_url} className='button gr-10-m gr-centered gr-padding-30 gr-child no-margin' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Join our global network of partners now')}</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WhoCanApply;
