import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../../_common/components/forms.jsx';

const ChangePassword = () => (
    <React.Fragment>
        <h1>{it.L('Change Password')}</h1>
        <form className='gr-padding-10' id='frm_change_password'>
            <Fieldset legend={it.L('Details')}>
                <FormRow autoComplete='current-password' type='password' id='old_password' label={it.L('Current password')} />
                <FormRow
                    autoComplete='new-password'
                    has_password_meter
                    type='password'
                    id='new_password'
                    label={it.L('New password')}
                />
                <SubmitButton type='submit' msg_id='frm_change_password_error' text={it.L('Change password')} />
            </Fieldset>
        </form>

        <p className='invisible' id='msg_success'>{it.L('Your password has been changed. Please log in again.')}</p>
    </React.Fragment>
);

export default ChangePassword;
