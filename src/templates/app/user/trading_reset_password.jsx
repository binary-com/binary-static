import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../_common/components/forms.jsx';

const TradingResetPassword = () => (
    <React.Fragment>
        <div className='static_full'>
            <h1>{it.L('Trading password reset')}</h1>
            <p className='notice-msg invisible' id='msg_trading_reset_password' />

            <div className='invisible' id='form_error'>
                <p className='error-msg' id='form_error_msg' />
                <a href={it.url_for('user/lost_passwordws')}>{it.L('Click here to retry')}</a>
            </div>

            <div className='gr-parent gr-padding-10' id='container_trading_reset_password'>
                <form id='frm_trading_reset_password'>
                    <Fieldset legend={it.L('Details')}>
                        <div className='gr-12'>
                            <p className='fieldset-subtitle'>{it.L('Enter a new trading password.')}</p>
                            <FormRow
                                autoComplete='new-password'
                                has_password_meter
                                type='password'
                                id='new_password'
                                label={it.L('New trading password')}
                            />
                            <SubmitButton type='submit' no_error text={it.L('Confirm password')} />
                        </div>
                    </Fieldset>
                </form>
            </div>
        </div>
    </React.Fragment>
);

export default TradingResetPassword;
