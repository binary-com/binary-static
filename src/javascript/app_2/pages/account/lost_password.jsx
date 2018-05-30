import React, { Component }    from 'react';
import Button                  from '../../components/form/button.jsx';
import PasswordField           from '../../components/form/password_field.jsx';
import { localize }            from '../../../_common/localize';

class LostPassword extends Component {
    state = {
        password: '',
    }

    onChange = (password) => {
        this.setState({password});
    }

    render() {
        return (
            <div className='static_full'>
                <h1>{localize('Password reset')}</h1>
                <p id='password_reset_description'>{localize('To reset your password, enter the email address you used to create your account into the field below and click \'Reset password\'.')}</p>

                <form id='frm_lost_password'>
                    <PasswordField
                        type='number'
                        name='amount'
                        value={this.state.password}
                        onChange={(password)=>this.onChange(password)}
                        is_currency
                        prefix={'hi'}
                        is_nativepicker={true}
                    />
                    <Button type='submit' msg_id='form_error' text={localize('Reset Password')} />
                </form>

                <p>{localize('If you don’t receive the email within the next few minutes, please check your junk/spam folder.')}</p>
            </div>
        );
    }
}

export default LostPassword;
