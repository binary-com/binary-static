import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SettingContentHeader } from '../components/setting_content_header.jsx';

class AuthorizedApplictions extends PureComponent {
    render() {
        const { title, content } = this.props;
        return (
            <div className='settings__content_container'>
                <SettingContentHeader title={title} content={content}/>
                <div className='settings__content_form_container'>balnk</div>
            </div>
        );
    }
}

AuthorizedApplictions.propTypes = {
    title  : PropTypes.string,
    content: PropTypes.string,
};

export default AuthorizedApplictions;
