import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../../_common/components/forms.jsx';

const ChangePassword = () => (
    <React.Fragment>
        <h1>{it.L('All you’ll need from now is one password')}</h1>
        <p className='notice-msg'>{it.L('We’ve upgraded our system to support a single, more secure password across all of [_1]. Once you’ve set a new password, you can use it to log into all your [_1], and MT5 accounts.', it.website_name)}</p>
        <form className='gr-padding-10' id='frm_change_password'>
            <Fieldset>
                <FormRow type='password' id='old_password' label={it.L('Current password')} />
                <FormRow type='password' id='new_password' label={it.L('New password')} hint={it.L('Minimum of eight lower and uppercase English letters with numbers')} />
                <FormRow type='password' id='repeat_password' label={it.L('Verify new password')} />
                <SubmitButton type='submit' msg_id='frm_change_password_error' text={it.L('Change password')} />
            </Fieldset>
        </form>

        <p className='invisible' id='msg_success'>{it.L('Your password has been changed. Please log in again.')}</p>
    </React.Fragment>
);

export default ChangePassword;
