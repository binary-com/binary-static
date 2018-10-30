import React from 'react';

const InterviewPopup = () => (
    <div id='interview_popup_container' className='invisible'>
        <div className='popup'>
            <div className='popup__head'>
                <img className='popup__present_img' src={it.url_for('images/interview_popup/present.svg')} alt='$30 present' />
                <h1>{it.L('Do you have 40 minutes for an interview?')}</h1>
            </div>
            <div className='popup__body'>
                <h2>{it.L('Earn $30 to trade on [_1]', it.website_name.toLowerCase())}</h2>
                <p>
                    {it.L('We\'re looking for users of [_1] to participate in a [_2]40-minute video or phone interview[_3]. To qualify, just answer a few short questions. If selected, you will receive an email or a phone call from one of our researchers.', it.website_name.toLowerCase(), '<strong>', '</strong>')}
                </p>
                <div className='popup__options'>
                    <div className='popup__secondary_options'>
                        <a href={'javascript:void(0);'} id='interview_no_thanks'>{it.L('No thanks')}</a>
                        <span className='popup__separator' />
                        <a href={'javascript:void(0);'} id='interview_ask_later'>{it.L('Ask me later')}</a>
                    </div>
                    <a href={'javascript:void(0);'} id='interview_interested' className='button' target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('I\'m interested')}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default InterviewPopup;
