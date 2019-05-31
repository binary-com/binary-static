import React from 'react';

const WhyPartner = () => (
    <section className='why-partner primary-bg-color'>
        <div className='container center-text full-height gr-padding-30'>
            <h2 className='center-text color-white'>{it.L('Why partner with us')}</h2>
            <div className='gr-row gr-padding-20'>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/commission.svg')} alt='Generous commissions' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('Generous commissions')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/conversion.svg')} alt='High conversions' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('High conversions')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/payment.svg')} alt='On-time payments' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('On-time payments')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/no-hidden-fees.svg')} alt='No hidden fees' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('No hidden fees')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/contact.svg')} alt='Customer-centric partnership' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('Customer-centric partnership')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/diversify-income.svg')} alt='Multiple income opportunities' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('Multiple income opportunities')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing.svg')} alt='Advanced referral tools' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('Advanced referral tools')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/support-faq.svg')} alt='International support' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('International support')}</h4>
                </div>
                <div className='gr-4 gr-padding-10'>
                    <img src={it.url_for('images/pages/affiliates_ib_landing/icons/globe.svg')} alt='Multilingual platforms' className='gr-centered' />
                    <h4 className='secondary-color'>{it.L('Multilingual platforms')}</h4>
                </div>
            </div>
        </div>
    </section>
);

export default WhyPartner;
