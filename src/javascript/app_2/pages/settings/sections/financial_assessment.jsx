import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SettingContentHeader } from '../components/setting_content_header.jsx';
import { FormSubmitButton } from '../components/form_submit_button.jsx';
import { FormFieldSetList } from '../components/form_field_set_list.jsx';
import { SettingsHelpContainer } from '../components/settings_help_container.jsx';
import Loading from '../../../../../templates/_common/components/loading.jsx';
import { connect } from '../../../store/connect';

class FinancialAssessment extends PureComponent {
    componentDidMount() {
        this.props.getFinancialAssessment();
    }

    render() {
        const { title, content, is_loading, onChange, data } = this.props;
        return (
            <div className='settings__content_container'>
                <SettingContentHeader title={title} content={content}/>
                {
                    is_loading ?
                        <Loading /> :
                        <div className='settings__container'>
                            <div className='settings__content_form__container'>
                                <FormFieldSetList data={data} onChange={onChange}/>
                                <div className='settings__content_form__submit_container'>
                                    <FormSubmitButton value='UPDATE'/>
                                </div>
                            </div>
                            <div>
                                <SettingsHelpContainer>
                                    <p className='settings__help_head_text'>Why do I need to fill this?</p>
                                    <p className='settings__help_text'>The financial trading services contained within this site are only suitable for customers who are able to bear the loss of all the money they invest and who understand and have experience of the risk involved in the acquisition of financial contracts. Transactions in financial contracts carry a high degree of risk. If purchased contracts expire worthless, you will suffer a total loss of your investment, which consists of the contract premium.</p>
                                </SettingsHelpContainer>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

FinancialAssessment.propTypes = {
    content               : PropTypes.string,
    data                  : PropTypes.object,
    getFinancialAssessment: PropTypes.func,
    is_loading            : PropTypes.bool,
    onChange              : PropTypes.func,
    title                 : PropTypes.string,
};

export default connect(
    ({ pages: { settings: { financial_assessment } } }) => ({
        is_loading            : financial_assessment.is_loading,
        data                  : financial_assessment.data,
        getFinancialAssessment: financial_assessment.getFinancialAssessment,
        onChange              : financial_assessment.onChange,
    })
)(FinancialAssessment);
