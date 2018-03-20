import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';
import AuthenticateMessageFinancial from '../_includes/authenticate_message_financial.jsx';
import AuthenticateMessage from '../_includes/authenticate_message.jsx';

const Authenticate = () => (
    <React.Fragment>
        <h1>{it.L('Authentication')}</h1>
        <div id='authentication-message'>
            <p id='fully_authenticated' className='invisible'>
                {it.L('Your account is fully authenticated. You can view your <a href="[_1]">trading limits here</a>.', it.url_for('user/security/limitsws'))}
            </p>

            <p id='needs_age_verification' className='invisible'>
                {it.L('Account needs age verification, please contact <a href="[_1]">customer support</a> for more information.', it.url_for('contact'))}
            </p>

            <div id='not_authenticated' className='invisible'>
                <AuthenticateMessage />
            </div>

            <div id='not_authenticated_financial' className='invisible'>
                <AuthenticateMessageFinancial />
            </div>

            <div id='success-message' className='center-text invisible'>
                <SeparatorLine className='gr-padding-10' invisible />
                <div className='ja-hide'>
                    <h2>{it.L('Thank you for submitting the required documents')}</h2>
                    <p>{it.L('We are reviewing your documents and will get back to you within one working day.')}</p>
                </div>
                <div className='invisible ja-show'>
                    <h2>{it.L('Thank you for uploading your Identity Documents.')}</h2>
                    <p>{it.L('Our Account Opening team will now review these and contact you by email. We are currently receiving many requests to open accounts but please be assured we will contact you again within 3 business days. Please check your spam folder if you haven\'t received anything from us by then.')}</p>
                    <a className="button" href={it.url_for('trading')}>
                        <span>{it.L('Practice trading')}</span>
                    </a>
                </div>
            </div>

            <p className='center-text notice-msg invisible' id='error_message' />
        </div>
    </React.Fragment>
);

export default Authenticate;
