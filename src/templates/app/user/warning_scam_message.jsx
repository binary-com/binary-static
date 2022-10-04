import React from 'react';

const WarningScamMessage = () => (
    <React.Fragment>
        <div id='warning_scam_message' className='invisible'>
            <div className='warning-scam-message-content'>
                <h1 className='warning-scam-message-title'>{it.L('Beware of the fake links.')}</h1>
                <p className='warning-scam-message-subtitle'>{it.L('A link can contain the word "Binary" and still be fake.')}</p>
                <h2 className='warning-scam-message-title-secondary'>{it.L('Do not get lured to fake "Binary" pages!')}</h2>
                <p className='warning-scam-message-text-secondary'>{it.L('You may see links to websites with a fake Binary login page where you’ll get scammed for your money. ')}</p>
                <div className='warning-scam-message-info-message'>
                    <img className='icon-sm margin-right-0' src={it.url_for('images/pages/warning_scam_message/ic-account-cross.svg')} />
                    <h3 className='warning-scam-message-scam-title-text'>{it.L('Do not trust and give away your credentials on fake websites, ads or emails.')}</h3>
                </div>
                <div className='warning-scam-message-correct-content'>
                    <div className='warning-scam-message-content-info-message'>
                        <img className='icon-sm margin-left-0' src={it.url_for('images/pages/warning_scam_message/ic-account-tick.svg')} />
                        <h3 className='warning-scam-message-scam-title-text'>
                            {it.L('Only log in to your account at this secure link, never elsewhere.')}
                        </h3>
                    </div>
                    <div className='warning-scam-message-link-container'>
                        <p className='warning-scam-message-link'>https://binary.com</p>
                    </div>
                </div>
                <div className='warning-scam-message-wrong-content'>
                    <div className='warning-scam-message-content-info-message'>
                        <img className='icon-sm margin-left-0' src={it.url_for('images/pages/warning_scam_message/ic-account-cross.svg')} />
                        <h3 className='warning-scam-message-scam-title-text'>
                            {it.L('Fake links often contain the word that looks like "Binary" but look out for these differences.')}
                        </h3>
                    </div>
                    <div className='warning-scam-message-link-container'>
                        <p className='warning-scam-message-link'>{it.L('Examples')}: https://binakyos.me</p>
                    </div>
                </div>
                <div className='warning-scam-message-checkbox-container'>
                    <input type='checkbox' id='warning_scam_message_checkbox' />
                    <label htmlFor='warning_scam_message_checkbox' className='warning-scam-message-acknowledge-message'>{it.L('I\'ve read the above carefully.')}</label>
                </div>
                <div className='warning-scam-message-button-icon-container'>
                    <img src={it.url_for('images/pages/warning_scam_message/ic-account-dont-get-scam.svg')} />
                    <button id='warning_scam_message_button' className='button-disabled'>{it.L('OK, got it')}</button>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default WarningScamMessage;
