import React from 'react';

const OTCStocks = () => (
    <div className='section-content section-9'>
        <h1>{it.L('What are OTC indices and stocks?')}</h1>

        <div className='gr-row'>
            <div className='gr-8 gr-12-m'>
                <p>{it.L('[_1]\'s OTC Indices and stocks offer the benefit of real-time charts and pricing. Enjoy even more exciting opportunities to trade our featured market indices and stocks through this new real-time offering.', it.website_name)}</p>
                <p>{it.L('[_1]\'s OTC Indices and stocks are sourced from the over-the-counter market and provide you with an alternative means of trading stock indices and stocks - available from sources outside of the centralised exchanges.', it.website_name)}</p>
                <p>{it.L('Please note that due to their over-the-counter nature, the prices of the OTC Indices and stocks will differ from the prices of the corresponding indices and stocks on centralised exchanges.')}</p>
            </div>

            <div className='gr-4 gr-12-m'>
                <p><img className='responsive' src={it.url_for('images/pages/get-started/otc-indices.svg')} /></p>
            </div>
        </div>
    </div>

);

export default OTCStocks;
