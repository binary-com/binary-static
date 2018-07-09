import React from 'react';

const Contract = () => (
    <div className='gr-12 gr-padding-30 gr-no-gutter'>
        <h2>{it.L('{JAPAN ONLY}Pre-contract Document')}</h2>
        <p>{it.L('Japan website Pre-contract Document Paragraph 1')}</p>
        <p>
            <a className='button' href={`${it.japan_docs_url}/documents/binary_maeshomen.pdf`} download target='_blank'>
                <span>{it.L('Japan website Download Text for Pre-contract Document')}</span>
            </a>
        </p>
    </div>
);

export default Contract;
