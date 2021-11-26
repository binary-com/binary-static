import React from 'react';

const EuClosePopup = () => (
    <div id='eu-close-popup' className='invisible gaming-close-popup'>
        <div id='top_popup' className='popup-content'>
            <div className='pop-up-header' onFocus={true}>
                <h3>Your Options Account is scheduled to be closed</h3>
                <p className='subtitle'>
                As part of the changes in our product line-up,
                we are closing Options Accounts belonging to our clients in Europe.
                </p>
                <div className='deriv_banner_close' />
            </div>
            <div className='popup-content-body'>
                <strong>What this means for you</strong>
                <p>
                    You are no longer able to trade options on any of our platforms.
                    Also, you can’t make deposits into your Options Account.
                </p>
                <strong>Withdraw all your funds</strong>
                <p>You will lose access to your Options Account when it gets closed,
                    so be sure to withdraw all your funds. (If you have a CFDs Account,
                    you can also transfer the funds from your Options Account to your CFDs Account.)
                </p>
            </div>
            <footer>
                <button id='eu-accept-btn' className='accept-btn'>OK, I understand</button>
            </footer>
        </div>
    </div>
);

export default EuClosePopup;
