import React from 'react';
import MFSA  from '../_common/includes/mfsa.jsx';
import { ButtonSocial } from  '../_common/components/elements.jsx';

const NewAccount = () => (
    <section>
        <MFSA />
        <div className='center-text gr-padding-20'>
            <h1 className='dark gr-padding-20 gr-child'>{it.L('Start Trading with [_1]', `<strong>${it.website_name}</strong>`)}</h1>
            <div>
                <div className='gr-4 gr-5-t gr-8-p gr-10-m gr-no-gutter gr-centered gr-padding-30 gr-parent'>
                    <form id='signup_form'>
                        <div className='gr-padding-20'>
                            <input autoFocus='true' autoComplete='off' name='email' id='email' maxLength='50' placeholder={it.L('Email')}  data-lpignore='true' />
                        </div>
                        <div>
                            <button type='submit'>{it.L('Create Free Account')}</button>
                        </div>
                    </form>
                    <div className='section-divider gr-padding-20 gr-child'>
                        <div className='align-self-center border-bottom-light-gray' />
                        <div className='no-circle'>{it.L('or')}</div>
                        <div className='align-self-center border-bottom-light-gray' />
                    </div>
                    <p>{it.L('Sign up using social account')}</p>
                    <div className='gr-row gr-row-align-center'>
                        <div className='gr-6 gr-4-m align-end'>
                            <ButtonSocial provider='google' />
                        </div>
                        <div className='gr-6 gr-4-m align-start'>
                            <ButtonSocial provider='facebook' />
                        </div>
                    </div>
                </div>
                <p>{it.L('Already have an account? [_1]Log in[_2] here', '<a id="login" href="javascript:;">', '</a>')}</p>
            </div>
        </div>

        <div id='verify_email' className='center-text invisible gr-padding-20'>
            <img className='gr-padding-20' src={it.url_for('images/common/email_sent.svg')} />
            <h1>{it.L('We\'re almost there')}</h1>
            <p>{it.L('Please check your email for the verification link to complete the process.')}</p>
        </div>
    </section>
);

export default NewAccount;
