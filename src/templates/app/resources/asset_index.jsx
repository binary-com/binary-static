import React from 'react';

const AssetIndex = () => (
    <div id='asset_index_wrapper' className='gr-centered gr-12-p gr-12-m'>
        <h1>{it.L('Asset Index')}</h1>
        <div className='gr-padding-10'>
            <p id='errorMsg' className='error-msg invisible' />
            <div id='asset-index' className='has-tabs gr-parent' />
        </div>
    </div>
);

export default AssetIndex;
