import React from 'react';

const InterviewPopup = () => (
    <div id='interview_popup_container' className='invisible'>
        <div className='popup'>
            <div className='popup__head'>
                <img className='popup__present_img' src={it.url_for('images/interview_popup/present.svg')} alt='$30 present' />
                <h1>Do you have 40 minutes for an interview?</h1>
            </div>
            <div className='popup__body'>
                <h2>Earn $30 to trade on binary.com</h2>
                <p>
                    We’re looking for users of binary.com to participate in a <b>40-minute video or phone interview</b>.
                    To qualify, just answer a few short questions.
                    If selected, you will receive an email or a phone call from one of our researchers.
                </p>
                <div className='popup__options'>
                    <div className='popup__secondary_options'>
                        <a href={'javascript:void(0);'} id='interview_no_thanks'>No thanks</a>
                        <span className='popup__separator' />
                        <a href={'javascript:void(0);'} id='interview_ask_later'>Ask me later</a>
                    </div>
                    <a href={'javascript:void(0);'} id='interview_interested' className='button' target='_blank' rel='noopener noreferrer'>
                        <span>I’m interested</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default InterviewPopup;
