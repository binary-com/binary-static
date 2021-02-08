import React from 'react';
import {
    Fieldset,
    FormRow,
    SubmitButton,
} from '../../_common/components/forms.jsx';
import FormVerificationCode from '../_includes/form_verification_code.jsx';

const ResetPasswordNotice = () => (
    <div className='static_full' id='lost_password_notice'>
        <h1>{it.L('All you’ll need from now is one password')}</h1>
        <p id='password_reset_description'>
            {it.L(
                'We’ve upgraded our system to support a single, more secure password across all of [_1]. Once you’ve set a new password, you can use it to log into all your [_1], and MT5 accounts.',
                it.website_name,
            )}
        </p>

        <SubmitButton
            type='button'
            id='lost_password_notice_button'
            text={it.L('Reset password')}
        />
    </div>
);

const ResetPasswordForm = () => (
    <div className='static_full invisible' id='lost_password_form'>
        <h1>{it.L('Password reset')}</h1>
        <p id='password_reset_description'>
            {it.L(
                'To reset your password, enter the email address you used to create your account into the field below and click \'Reset password\'.'
            )}
        </p>
        <FormVerificationCode />

        <form id='frm_lost_password'>
            <Fieldset>
                <FormRow
                    type='text'
                    id='email'
                    label={it.L('Email address')}
                    attributes={{ autoComplete: 'off', maxLength: '50' }}
                />
                <SubmitButton
                    type='submit'
                    msg_id='form_error'
                    text={it.L('Reset password')}
                />
            </Fieldset>
        </form>

        <p id='check_spam' className='invisible'>
            {it.L(
                'If you don\'t receive the email within the next few minutes, please check your junk/spam folder.'
            )}
        </p>
    </div>
);

const LostPassword = () => (
    <React.Fragment>
        <ResetPasswordNotice />
        <ResetPasswordForm />
    </React.Fragment>
);

export default LostPassword;
