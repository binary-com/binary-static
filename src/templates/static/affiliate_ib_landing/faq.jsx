import React from 'react';

const FAQ = () => (
    <section className='faq'>
        <div className='container center-text'>
            <h2 className='faq-header'>{it.L('Frequently asked questions')}</h2>

            <div className='gr-row'>
                <div className='gr-10 gr-12-m gr-12-p gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m gr-padding-10'>
                            <div className='faq-item'>
                                <p className='faq-item-header secondary-color'>{it.L('Affiliate')}</p>

                                <ul className='faq-item-content'>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg')} alt='General' />
                                        <a href={`${it.url_for('affiliate/faq')}#general`} className='faq-item-content-text'>{it.L('General')}</a>
                                    </li>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg')} alt='Account management' />
                                        <a href={`${it.url_for('affiliate/faq')}#account-management-and-tracking`} className='faq-item-content-text'>{it.L('Account management')}</a>
                                    </li>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg')} alt='Referral tools' />
                                        <a href={`${it.url_for('affiliate/faq')}#referral-tools`} className='faq-item-content-text'>{it.L('Referral tools')}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m gr-padding-10'>
                            <div className='faq-item'>
                                <p className='faq-item-header secondary-color'>{it.L('Introducing Broker')}</p>

                                <ul className='faq-item-content'>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/marketing-dark.svg')} alt='General' />
                                        <a href={`${it.url_for('ib-programme/ib-faq')}#general`} className='faq-item-content-text'>{it.L('General')}</a>
                                    </li>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/account-dark.svg')} alt='Account management' />
                                        <a href={`${it.url_for('ib-programme/ib-faq')}#account-management`} className='faq-item-content-text'>{it.L('Account management')}</a>
                                    </li>
                                    <li>
                                        <img className='faq-item-content-image' src={it.url_for('images/pages/affiliates_ib_landing/icons/general-faq-dark.svg')} alt='Referral tools' />
                                        <a href={`${it.url_for('ib-programme/ib-faq')}#referral-tools`} className='faq-item-content-text'>{it.L('Referral tools')}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className='faq-message'>{it.L('For further assistance, email us at [_1]affiliates@binary.com[_2]', '<a href="mailto:affiliates@binary.com">', '</a>')}</p>
        </div>
    </section>
);

export default FAQ;
