import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SettingContentHeader } from '../components/setting_content_header.jsx';
import { FormSubmitButton } from '../components/form_submit_button.jsx';
import { FormFieldSetList } from '../components/form_field_set_list.jsx';
import Loading from '../../../../../templates/_common/components/loading.jsx';
import { connect } from '../../../store/connect';
import { SettingsHelpContainer } from '../components/settings_help_container.jsx';

class SelfExclusion extends PureComponent {
    componentDidMount() {
        this.props.getSelfExclusion();
    }

    render() {
        const { title, content, is_loading, data, handleSubmit, onChange } = this.props;
        return (
            <form className='settings__content_container' onSubmit={handleSubmit}>
                <SettingContentHeader title={title} content={content}/>
                {
                    is_loading ?
                        <Loading /> :
                        <div className='settings__container'>
                            <div className='settings__content_form__container'>
                                <FormFieldSetList data={data} onChange={onChange}/>
                                <div className='settings__content_form__submit_container'>
                                    <FormSubmitButton value='Update Settings'/>
                                </div>
                            </div>
                            <div>
                                <SettingsHelpContainer>
                                    <p className='settings__help_head_text'>What is Self Exclusion for?</p>
                                    <p className='settings__help_text'>Fill in the form below to limit your participation on the website or send a signed letter or fax to our customer support team. Once set, you can only tighten your limits Limits will only be removed or loosened after 7 days with the exception of the self-exclusion date, which cannot be removed or altered once you have confirmed it. To remove or increase your limits, please contact <span className='settings_link'>customer support</span></p>
                                </SettingsHelpContainer>
                            </div>
                        </div>
                }
            </form>
        );
    }
}

SelfExclusion.propTypes = {
    content         : PropTypes.string,
    data            : PropTypes.object,
    getSelfExclusion: PropTypes.func,
    handleSubmit    : PropTypes.func,
    is_loading      : PropTypes.bool,
    onChange        : PropTypes.func,
    title           : PropTypes.string,
};

export default connect(
    ({ pages: { settings: { self_exclusion } } }) => ({
        is_loading      : self_exclusion.is_loading,
        data            : self_exclusion.data,
        getSelfExclusion: self_exclusion.getSelfExclusion,
        handleSubmit    : self_exclusion.handleSubmit,
        onChange        : self_exclusion.onChange,
    })
)(SelfExclusion);
