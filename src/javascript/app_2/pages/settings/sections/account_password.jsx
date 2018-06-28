import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormSubmitButton } from '../components/form_submit_button.jsx';
import { SettingContentHeader } from '../components/setting_content_header.jsx';
import { FormFieldSetList } from '../components/form_field_set_list.jsx';
import { connect } from '../../../store/connect';
import { SettingsHelpContainer } from '../components/settings_help_container.jsx';

class AccountPassword extends PureComponent {

    render() {
        const { title, content, data, onChange } = this.props;

        return (

            <form  method='get'>
                <div className='settings__content_container'>
                    <SettingContentHeader title={title} content={content}/>
                    <div className='settings__container'>
                        <div className='settings__content_form__container'>
                            <FormFieldSetList data={data} onChange={onChange}/>
                            <div className='settings__content_form__submit_container'>
                                <FormSubmitButton value='Change Password'/>
                            </div>
                        </div>
                        <div>
                            <SettingsHelpContainer>
                                <p className='settings__help_head_text'>How to choose a strong password:</p>
                                <p className='settings__help_text'>Length within 6-25 character with lower and uppercase letters with numbers for new password.</p>
                                <p className='settings__help_text'><span className='settings_link'>Forgot your password?</span></p>
                            </SettingsHelpContainer>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

AccountPassword.propTypes = {
    content : PropTypes.string,
    data    : PropTypes.object,
    onChange: PropTypes.func,
    title   : PropTypes.string,
};

export default connect(
    ({ pages: { settings: { account_password } } }) => ({
        data    : account_password.data,
        onChange: account_password.onChange,
    })
)(AccountPassword);
