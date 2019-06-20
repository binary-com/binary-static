import React                        from 'react';
import Loading                      from '../../_common/components/loading.jsx';
import AuthenticateMessageFinancial from '../_includes/authenticate_message_financial.jsx';
import AuthenticateMessage          from '../_includes/authenticate_message.jsx';

const Authenticate = () => (
    <React.Fragment>
        <Loading id='authentication_loading' />
        <div id='onfido' className='invisible'>
            <div id='upload_complete' className='center-text gr-padding-20 invisible'>
                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/letter.svg')} />
                <h1 className='gr-padding-10'>{it.L('Thank you for uploading your documents!')}</h1>
                <p>{it.L('We will send an email after verifying your documents')}</p>
            </div>

            <div id='error_occured' className='center-text gr-padding-20 invisible'>
                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/clock.svg')} />
                <h1 className='gr-padding-10'>{it.L('Sorry,')}</h1>
                <p>{it.L('there was a connection error. Please try again later.')}</p>
            </div>

            <div id='unverified' className='center-text gr-padding-20 invisible'>
                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                <h1 className='gr-padding-10'>{it.L('Sorry, the authentication was not successful.')}</h1>
                <p>{it.L('Don\'t worry, we will send you an email to assist you further.')}</p>
            </div>

            <div id='verified' className='center-text gr-padding-20 invisible'>
                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                <h1 className='gr-padding-10'>{it.L('You have been successfully verified')}</h1>
            </div>
        </div>
        <div id='authentication' className='invisible'>
            <h1>{it.L('Authentication')}</h1>
            <div id='authentication-message'>
                <div id='loading_authenticate'>
                    <Loading />
                </div>

                <p id='fully_authenticated' className='invisible'>
                    {it.L('Your account is fully authenticated. You can view your [_1]trading limits here[_2].', `<a href="${it.url_for('user/security/limitsws')}">`, '</a>')}
                </p>

                <p id='needs_age_verification' className='invisible'>
                    {it.L('Account needs age verification, please contact [_1]customer support[_2] for more information.', `<a href="${it.url_for('contact')}">`, '</a>')}
                </p>

                <div id='not_authenticated' className='invisible'>
                    <AuthenticateMessage />
                </div>

                <div id='success-message' className='center-text gr-gutter gr-padding-10 invisible'>
                    <h2>{it.L('Thank you')}</h2>
                    <p>{it.L('We will review your documents and get back to you within 3 working days.')}</p>
                </div>

                <div id='not_authenticated_financial' className='invisible'>
                    <AuthenticateMessageFinancial />
                </div>

                <p className='center-text notice-msg invisible' id='error_message' />
            </div>
        </div>
    </React.Fragment>
);

export default Authenticate;
