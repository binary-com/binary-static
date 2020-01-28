import React from 'react';

const DP2P = () => (
    <React.Fragment>
        <div className='invisible' id='message_cashier_unavailable'>
            <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
        </div>
        <div className='invisible show_mobile' id='message_mobile_view'>
            <p className='notice-msg center-text'>{it.L('Sorry, mobile version is not available yet.')}</p>
        </div>
        <div id='binary-dp2p' className='gr-hide-m' />
    </React.Fragment>
);

export default DP2P;
