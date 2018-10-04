import React from 'react';
import MFSA  from '../_common/includes/mfsa.jsx';

const NewAccount = () => (
    <React.Fragment>
        <MFSA />
        <form id='signup_form' className='center-text gr-padding-20'>
            <h1 className='dark gr-padding-20 gr-child'>{it.L('Start Trading with [_1]', `<strong>${it.website_name}</strong>`)}</h1>
            <div>
                <div className='gr-4 gr-5-t gr-8-p gr-10-m gr-no-gutter gr-centered gr-padding-30 gr-parent'>
                    <div className='gr-padding-20'>
                        <input autoComplete='off' name='email' id='email' maxLength='50' placeholder={it.L('Email')} />
                    </div>
                    <div>
                        <button type='submit'>{it.L('Create Free Account')}</button>
                    </div>
                    <div className='section-divider gr-padding-20'>
                        <div className='align-self-center border-bottom-light-gray' />
                        <div className='circle'>{it.L('or')}</div>
                        <div className='align-self-center border-bottom-light-gray' />
                    </div>
                    <a id='google-signup' href='javascript:;' className='button-white'>
                        <span className='icon-google'>{it.L('Create account with Google')}</span>
                    </a>
                </div>
                <p>{it.L('Already have an account? [_1]Log in[_2] here', '<a id="login" href="javascript:;">', '</a>')}</p>
            </div>
        </form>

        <div id='verify_email' className='center-text invisible gr-padding-20'>
            <img className='gr-padding-20' src={it.url_for('images/common/email_sent.svg')} />
            <h1>{it.L('We\'re almost there')}</h1>
            <p>{it.L('Please check your email for the verification link to complete the process.')}</p>
        </div>
    </React.Fragment>
);

export default NewAccount;
