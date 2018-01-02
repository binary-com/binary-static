import React from 'react';

const AssetIndex = () => (
    <React.Fragment>
        <h1>{it.L('Asset Index')}</h1>
        <div className='gr-padding-10'>
            <p id='errorMsg' className='error-msg invisible'></p>
            <div id='asset-index' className='has-tabs gr-parent'></div>
        </div>
    </React.Fragment>
);

export default AssetIndex;
