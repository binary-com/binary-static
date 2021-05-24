import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../_common/components/forms.jsx';

const ResetPassword = () => (
    <React.Fragment>
        <div className='static_full'>
            <h1 id='password_reset_header' />
            <p className='notice-msg invisible' id='msg_reset_password' />

            <div className='invisible' id='form_error'>
                <p id='form_error_msg' />
                <a href={it.url_for('user/lost_passwordws')}>{it.L('Click here to retry')}</a>
            </div>

            <div className='gr-parent gr-padding-10 invisible' id='container_reset_password'>
                <form id='frm_reset_password'>
                    <Fieldset legend={it.L('Details')}>
                        <div className='gr-12'>
                            <p className='fieldset-subtitle'>{it.L('Enter a new Binary password.')}</p>
                            <FormRow
                                autoComplete='new-password'
                                has_password_meter
                                type='password'
                                id='new_password'
                                label={it.L('New Binary password')}
                            />
                            <SubmitButton type='submit' no_error text={it.L('Reset my password')} />
                        </div>
                    </Fieldset>
                </form>
            </div>
            <div className='gr-parent gr-padding-10 invisible' id='container_reset_binary_password'>
                <form id='frm_reset_binary_password'>
                    <Fieldset legend={it.L('Details')}>
                        <div className='gr-12'>
                            <p className='fieldset-subtitle'>{it.L('Enter a new password for your Binary account.')}</p>
                            <FormRow
                                autoComplete='new-binary-password'
                                has_password_meter
                                type='password'
                                id='new_binary_password'
                                label={it.L('New Binary password')}
                            />
                        </div>
                        <SubmitButton type='submit' no_error text={it.L('Confirm password')} />
                    </Fieldset>
                </form>
            </div>
        </div>
    </React.Fragment>
);

export default ResetPassword;
