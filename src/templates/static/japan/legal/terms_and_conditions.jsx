import React from 'react';

const TermsAndConditions = () => (
    <div className='gr-12 gr-padding-30 gr-no-gutter'>
        <h2>{it.L('{JAPAN ONLY}Terms and Conditions')}</h2>
        <p>{it.L('Japan website Terms and Conditions Paragraph 1')}</p>
        <p>
            <a className='button' href={`${it.japan_docs_url}/documents/binary_torihiki_yakkan.pdf`} download target='_blank'>
                <span>{it.L('{Japan Only} Download Terms and Conditions Document file')}</span>
            </a>
        </p>
    </div>
);

export default TermsAndConditions;
