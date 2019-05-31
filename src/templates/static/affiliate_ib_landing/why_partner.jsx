import React from 'react';

const WhyPartner = () => {
    const reasons = [
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/commission.svg'),
            description: it.L('Generous commissions'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/conversion.svg'),
            description: it.L('High conversions'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/payment.svg'),
            description: it.L('On-time payments'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/no-hidden-fees.svg'),
            description: it.L('No hidden fees'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/contact.svg'),
            description: it.L('Customer-centric partnership'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/diversify-income.svg'),
            description: it.L('Multiple income opportunities'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/marketing.svg'),
            description: it.L('Advanced referral tools'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/support-faq.svg'),
            description: it.L('International support'),
        },
        {
            image      : it.url_for('images/pages/affiliates_ib_landing/icons/globe.svg'),
            description: it.L('Multilingual platforms'),
        },
    ];

    return (
        <section id='why-partner' className='primary-bg-color'>
            <div className='container center-text gr-padding-30'>
                <h2 className='center-text color-white'>{it.L('Why partner with us')}</h2>
                <div className='gr-row gr-padding-20'>
                    { reasons.map((reason, index) => (
                        <div key={index} className='gr-4 gr-padding-10'>
                            <img src={reason.image} alt='Multilingual platforms' className='gr-centered' />
                            <h4 className='secondary-color'>{reason.description}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyPartner;
