import React from 'react';

const AffiliateIbLanding = () => (
    <React.Fragment>
        <div className='affiliate-ib-landing'>
            <section id='page_top' className='hero'>
                <h1>Build a rewarding and long-term business relationship with an industry pioneer</h1>
                <button><span className='btn-text'>Become our partner</span></button>
            </section>

            <section className='statistics'>
                <article className='statistics-item'>
                    <h1>40K+</h1>
                    <h3>Partners</h3>
                </article>
                <article className='statistics-item'>
                    <h1>$12M+</h1>
                    <h3>Partner earnings</h3>
                </article>
                <article className='statistics-item'>
                    <h1>150+</h1>
                    <h3>Countries</h3>
                </article>
                <article className='statistics-item'>
                    <h1>1M+</h1>
                    <h3>Clients</h3>
                </article>
            </section>
        </div>

        <section className='how-it-works'>
            <div className='container'>
                <h2>How it works</h2>
                <div className='gr-row'>
                    <div className='gr-4'>
                        <h3>Sign up</h3>
                        <p>
                            Choose your preferred programme,
                            complete the application form,
                            and receive your affiliate link upon approval
                        </p>
                    </div>
                    <div className='gr-4'>
                        <h3>Introduce Binary.com</h3>
                        <p>
                            Spread the word to your audience.
                            Use your unique referral link and our
                            tried-and-tested referral tools to drive
                            traffic to Binary.com.
                        </p>
                    </div>
                    <div className='gr-4'>
                        <h3>Earn</h3>
                        <p>
                            Refer new clients to us.
                            Receive commissions based
                            on your chosen partnership
                            programme.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </React.Fragment>
);

export default AffiliateIbLanding;
