import React from 'react';

// eslint-disable-next-line arrow-body-style
const DP2P = () => {

    return (
        <React.Fragment>
            <div className='invisible' id='message_cashier_unavailable'>
                <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
            </div>
            <div id='binary-dp2p' />
        </React.Fragment>
    );
};

export default DP2P;
