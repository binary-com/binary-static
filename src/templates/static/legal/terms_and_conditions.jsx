import React from 'react';

const Section = ({
    id = '',
    link_id,
    className = '',
    children,
    sectionNum,
}) => (
    <div id={id} className={`section ${className}`}>
        <a id={link_id} />
        <div className='section-content'>
            <div id={`section-${sectionNum}`}>{children}</div>
        </div>
    </div>
);

const TermsAndConditions = () => (
    <div className='tac-binary gr-row'>
        <div className='gr-12 gr-12-m gr-parent'>
            <Section sectionNum='1' link_id='deriv-tnc'>
                <div className='tnc center-text'>
                    <img src={it.url_for('images/pages/terms-and-conditions/binary-to-deriv.svg')} alt={it.L('Binary to Deriv')} className='tnc_img' />
                    <h2 data-anchor='deriv-tnc'>{it.L('We have updated our terms and conditions')}</h2>
                    <div className='tnc_text'>
                        <p>{it.L('We have updated our terms of service as part of our rebranding from [_1] to Deriv. You can review the updated terms and conditions at Deriv.com. Note that all [_1] users are now bound by the terms and conditions of Deriv. ', it.website_name)}</p>
                    </div>
                    <a className='button tnc_btn' href='https://deriv.com/terms-and-conditions' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Go to terms and conditions')}</span>
                    </a>
                </div>
            </Section>
        </div>
    </div>
);

export default TermsAndConditions;
