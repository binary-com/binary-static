import React from 'react';

const SmartIndices = () => (
    <React.Fragment>
        <div className='section-content section-8'>
            <h1>{it.L('Smart Indices')}</h1>
            <h2>{it.L('Smart FX')}</h2>
            <p>{it.L('[_1]\'s Smart FX are smart markets that measure the value of a currency against a basket of major currencies.', it.website_name)}</p>

            <div className='gr-row gr-row-align-middle'>
                <div className='gr-4'>
                    <img className='responsive' src={it.url_for('images/pages/smart-indices/smart-indices-2.svg')} />
                </div>
                <div className='gr-8'>
                    <p>{it.L('The USD Index is a weighted Index, measuring the US Dollar\'s value against a basket of 5 global currencies (EUR, GBP, JPY, CAD, AUD), each weighted by 20%.')}</p>
                </div>
            </div>

            <p>{it.L('The AUD Index is a weighted Index, measuring the Australian Dollar\'s value against a basket of 5 global currencies (USD, EUR, GBP, JPY, CAD), each weighted by 20%.')}</p>
            <p>{it.L('The EUR Index is a weighted Index, measuring the Euro\'s value against a basket of 5 global currencies (USD, AUD, GBP, JPY, CAD), each weighted by 20%.')}</p>
            <p>{it.L('The GBP Index is a weighted Index, measuring the British Pound\'s value against a basket of 5 global currencies (USD, EUR, AUD, JPY, CAD), each weighted by 20%.')}</p>
        </div>
    </React.Fragment>
);

export default SmartIndices;
