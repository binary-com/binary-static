import React from 'react';

const Register = ({ lang = 'en' }) => {
    const language_is_ja = lang.toLowerCase() === 'ja';

    return (
        <React.Fragment>
            <div className='gr-padding-10 gr-gutter fill-bg-color'>
                <h4><strong>{language_is_ja ? it.L('{JAPAN ONLY}Register') : it.L('Register')}</strong></h4>
            </div>

            <div className='center-text gr-padding-10'>
                <a className='button' href={it.affiliate_signup_url}>
                    <span>{language_is_ja ? it.L('{JAPAN ONLY}Sign me up') : it.L('Sign me up')}</span>
                </a>
            </div>
        </React.Fragment>
    );
};

export default Register;
