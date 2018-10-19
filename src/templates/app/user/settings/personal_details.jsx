import React from 'react';
import AuthenticateMessageFinancial from '../../_includes/authenticate_message_financial.jsx';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';
import {
    AccountOpeningReason,
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressState,
    AddressPostcode,
    Phone,
    TaxInformationForm,
    GeocodeResponse,
} from '../../../_common/components/forms_common_rows.jsx';
import Loading from '../../../_common/components/loading.jsx';

const PersonalDetails = () => (
    <React.Fragment>
        <h1>{it.L('Personal Details')}</h1>

        <p className='notice-msg center-text invisible' id='missing_details_notice'>
            {it.L('Please complete your personal details before you proceed.')}
        </p>

        <div id='loading'>
            <Loading />
        </div>

        <div id='msg_main' className='invisible'>
            <p>{it.L('Thank you for completing your Personal Details. You can now deposit funds and trade Forex with real money on MetaTrader 5.')}</p>
            <div id='msg_authenticate' className='invisible'>
                <div><strong>{it.L('Important')}</strong></div>
                <AuthenticateMessageFinancial />
            </div>
            <div className='center-text'>
                <a className='button' href={it.url_for('user/metatrader')}>
                    <span>{it.L('Go to MetaTrader 5 Dashboard')}</span>
                </a>
            </div>
        </div>

        <form className='form gr-padding-10 invisible' id='frmPersonalDetails'>
            <Fieldset legend={it.L('Details')}>
                <FormRow type='label'  label={it.L('Name')} is_bold id='name' row_class='invisible RealAcc' row_id='row_name' />
                <FormRow type='label'  label={it.L('Date of birth')} is_bold id='date_of_birth' row_class='invisible RealAcc' />
                <FormRow type='label'  label={it.L('Citizenship')} id='lbl_citizen' row_id='row_lbl_citizen' row_class='invisible' />
                <FormRow type='select' label={it.L('Citizenship')} id='citizen' row_id='row_citizen' row_class='invisible' attributes={{ single: 'single' }} />
                <FormRow type='label'  label={it.L('Place of birth')} id='lbl_place_of_birth' row_id='row_lbl_place_of_birth' row_class='invisible' />
                <FormRow type='select' label={it.L('Place of birth')} id='place_of_birth' row_id='row_place_of_birth' row_class='invisible' attributes={{ single: 'single' }} />
                <FormRow type='label'  label={it.L('Country of Residence')} is_bold id='country' row_id='row_country' />
                <FormRow type='label'  label={it.L('Email address')} is_bold id='email' row_id='row_email' />
                <FormRow type='label'  label={it.L('Account Opening Reason')} id='lbl_account_opening_reason' row_id='row_lbl_account_opening_reason' row_class='invisible' />
                <AccountOpeningReason row_id='row_account_opening_reason' row_class='invisible' />
            </Fieldset>

            <Fieldset id='tax_information_form' className='invisible RealAcc' legend={it.L('Tax Information')}>
                <TaxInformationForm />
            </Fieldset>

            <Fieldset id='address_form' className='invisible RealAcc' legend={it.L('Address')}>
                <p className='hint'>{it.L('Please enter your full address to avoid authentication delays.')}</p>
                <AddressLine1 no_hint />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode />
                <Phone />
                <GeocodeResponse />
            </Fieldset>

            <Fieldset id='fieldset_email_consent' legend={it.L('Email Preferences')}>
                <FormRow type='checkbox' label={it.L('Receive emails on [_1] products, services, and events', it.website_name)} id='email_consent' label_row_id='email_consent_label' />
            </Fieldset>

            <SubmitButton id='btn_update' msg_id='formMessage' type='submit' text={it.L('Update')} />
        </form>

        <p className='required invisible RealAcc rowCustomerSupport'>{it.L('To change your name, date of birth, country of residence, or email, please contact <a href="[_1]">Customer Support</a>.', it.url_for('contact'))}</p>
    </React.Fragment>
);

export default PersonalDetails;
