import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../_common/components/forms.jsx';

const ResetPassword = () => (
    <React.Fragment>
        <div className='static_full'>
            <h1>{it.L('Password Reset')}</h1>
            <p className='notice-msg invisible' id='msg_reset_password' />

            <div className='invisible' id='form_error'>
                <p id='form_error_msg' />
                <a href={it.url_for('user/lost_passwordws')}>{it.L('Click here to retry')}</a>
            </div>

            <div className='gr-parent gr-padding-10' id='container_reset_password'>
                <form id='frm_reset_password'>
                    <Fieldset legend={it.L('Details')}>
                        <FormRow
                            autoComplete='new-password'
                            has_password_meter
                            type='password'
                            id='new_password'
                            label={it.L('New Password')}
                        />
                        <div className='gr-8 gr-push-4 gr-12-m gr-push-0-m center-text-m'>
                            <p className='hint password--hint'>
                                {it.L('Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.')}
                            </p>
                        </div>
                        <SubmitButton type='submit' no_error text={it.L('Reset password')} />
                    </Fieldset>
                </form>
            </div>
        </div>
    </React.Fragment>
);

export default ResetPassword;
