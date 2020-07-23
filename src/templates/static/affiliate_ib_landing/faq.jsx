import React from 'react';

const FAQ = () => {
    const affiliate_faq_items = [
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg'),
            link : `${it.url_for('affiliate/faq')}#general`,
            text : it.L('General'),
        },
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg'),
            link : `${it.url_for('affiliate/faq')}#account-management-and-tracking`,
            text : it.L('Account management'),
        },
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg'),
            link : `${it.url_for('affiliate/faq')}#referral-tools`,
            text : it.L('Referral tools'),
        },
    ];

    const ib_faq_items = [
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg'),
            link : `${it.url_for('ib-programme/ib-faq')}#general`,
            text : it.L('General'),
        },
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg'),
            link : `${it.url_for('ib-programme/ib-faq')}#account-management`,
            text : it.L('Account management'),
        },
        {
            image: it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg'),
            link : `${it.url_for('ib-programme/ib-faq')}#referral-tools`,
            text : it.L('Referral tools'),
        },
    ];

    return (
        <section className='faq center-text'>
            <h2 className='faq-header'>{it.L('Frequently asked questions')}</h2>

            <div className='gr-row gr-row-align-center'>
                <div className='faq-item gr-3 gr-12-m gr-5-p gr-5-t'>
                    <p className='faq-item-header secondary-color'>{it.L('Affiliate')}</p>

                    <ul className='faq-item-content'>
                        { affiliate_faq_items.map((item, index) => (
                            <li key={index}>
                                <img className='faq-item-content-image' src={item.image} alt={item.text} />
                                <a href={item.link} className='faq-item-content-text'>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='faq-item gr-3 gr-12-m gr-5-p gr-5-t'>
                    <p className='faq-item-header secondary-color'>{it.L('Introducing Broker')}</p>

                    <ul className='faq-item-content'>
                        { ib_faq_items.map((item, index) => (
                            <li key={index}>
                                <img className='faq-item-content-image' src={item.image} alt={item.text} />
                                <a href={item.link} className='faq-item-content-text'>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className='faq-message'>{it.L('For further assistance, email us at [_1]partners@binary.com[_2]', '<a href="mailto:partners@binary.com">', '</a>')}</p>
        </section>
    );
};

export default FAQ;
