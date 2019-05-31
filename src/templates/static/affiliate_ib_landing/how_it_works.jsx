import React from 'react';

const HowItWorks = () => (
    <section className='how-it-works'>
        <div className='container center-text gr-padding-20'>
            <h2>{it.L('How it works')}</h2>
            <div className='gr-row'>
                <div className='gr-4 gr-12-m gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-2 gr-hide-m gr-hide-p' />
                        <div className='gr-8 gr-12-m gr-12-p'>
                            <img src={it.url_for('images/pages/affiliates_ib_landing/icons/signup.svg')} />
                        </div>
                        <div className='gr-2 gr-hide-m gr-hide-p align-self-center'>
                            <img src={it.url_for('images/pages/affiliates_ib_landing/icons/circle_arrow.svg')} />
                        </div>
                    </div>
                    <h3>{it.L('Sign up')}</h3>
                    <p>{it.L('Choose your preferred programme, complete the application form, and receive your affiliate link upon approval.')}</p>
                </div>
                <div className='gr-4 gr-12-m gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-1 gr-hide-m gr-hide-p' />
                        <div className='gr-10 gr-12-m gr-12-p'>
                            <img src={it.url_for('images/pages/affiliates_ib_landing/icons/introduce.svg')} />
                        </div>
                        <div className='gr-1 gr-hide-m gr-hide-p align-self-center'>
                            <img src={it.url_for('images/pages/affiliates_ib_landing/icons/circle_arrow.svg')} />
                        </div>
                    </div>
                    <h3>{it.L('Introduce [_1]', it.website_name)}</h3>
                    <p>{it.L('Spread the word to your audience. Use your unique referral link and our tried-and-tested referral tools to drive traffic to [_1].', it.website_name)}</p>
                </div>
                <div className='gr-4 gr-12-m gr-centered'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/earn.svg')} />
                    <h3>{it.L('Earn')}</h3>
                    <p>{it.L('Refer new clients to trade with us. Receive commissions based on your chosen partnership programme.')}</p>
                </div>
            </div>
        </div>
    </section>
);

export default HowItWorks;
