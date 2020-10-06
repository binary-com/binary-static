import React from 'react';

const DerivTnc = () => (
    <div className='tnc'>
        <img src={it.url_for('images/pages/terms-and-conditions/binary-to-deriv.svg')} alt={it.L('Binary to Deriv')} className='tnc_img' />
        <h2>{it.L('We have updated our terms and conditions')}</h2>
        <div className='tnc_text'>
            <p>{it.L('We have updated our terms of service as part of our rebranding from [_1] to Deriv. You can review the updated terms and conditions at Deriv.com. Note that all [_1] users are now bound by the terms and conditions of Deriv. ', it.website_name)}</p>
        </div>
        <a className='button tnc_btn' href='https://deriv.com/terms-and-conditions' target='_blank' rel='noopener noreferrer'>
            <span>{it.L('Go to terms and conditions')}</span>
        </a>
    </div>
);

export default DerivTnc;
