import React, { PureComponent } from 'react';
import { SettingContentHeader } from '../components/setting_content_header.jsx';

class AccountPassword extends PureComponent {
    render() {
        const { title, content } = this.props;
        return (
            <div className='settings__content_container'>
                <SettingContentHeader title={title} content={content}/>
                <div className='settings__content_form_container'></div>
            </div>
        );
    }
}

export default AccountPassword;