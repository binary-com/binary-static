import React from 'react';
import {
    Salutation,
    FirstName,
    LastName,
    DateOfBirth,
    Citizenship,
    PlaceOfBirth,
    AccountOpeningReason,
    Phone,
    TaxResidence,
    TaxIdentificationNumber,
    TaxIdentificationConfirm,
} from '../../../_common/components/forms_common_rows.jsx';
import { Fieldset } from '../../../_common/components/forms.jsx';

const PersonalDetailForm = () => (
    <React.Fragment>
        <form id='personal_detail_step_form' className='gr-padding-10'>
            <div className='gr-9 gr-12-m auto-margin'>
                <Fieldset id='name_section' legend={it.L('Name')} legend_id='name_section_legend' className='invisible'>
                    <Salutation row_id='salutation_row' row_class='input-disabled invisible' />
                    <FirstName row_id='first_name_row' row_class='input-disabled invisible' />
                    <LastName row_id='last_name_row' row_class='input-disabled invisible' />
                </Fieldset>
                <Fieldset id='detail_section' legend={it.L('Other details')} className='fieldset_margin_top invisible'>
                    <DateOfBirth row_id='date_of_birth_row' row_class='input-disabled invisible' />
                    <PlaceOfBirth row_id='place_of_birth_row' row_class='invisible' />
                    <Citizenship row_id='citizen_row' row_class='invisible' />
                    <Phone row_id='phone_row' row_class='invisible' />
                </Fieldset>
                <Fieldset id='tax_section' legend={it.L('Tax information')} className='fieldset_margin_top invisible'>
                    <TaxResidence row_id='tax_residence_row' row_class='invisible' />
                    <TaxIdentificationNumber row_id='tax_identification_number_row' row_class='invisible' />
                    <p id='tax_id_warning' className='notice-msg invisible gr-9 gr-centered'>
                        {it.L('This Tax Identification Number (TIN) is invalid. You may continue, but to facilitate future payment processes, valid tax information will be required.')}
                    </p>
                    <TaxIdentificationConfirm row_id='tax_identification_confirm_row' row_class='invisible' />
                </Fieldset>
                <Fieldset id='account_opening_reason_section' legend={it.L('Account opening reason')} className='fieldset_margin_top invisible'>
                    <AccountOpeningReason row_id='account_opening_reason_row' row_class='invisible' />
                </Fieldset>
            </div>
            <div className='align-end' id='submit_section'>
                <a className='button button-secondary btn_cancel action_previous margin-v-10 inline-block-button' href='javascript:;'><span>{it.L('Previous')}</span></a>
                <button className='button margin-v-10' type='submit'>{it.L('Next')}</button>
            </div>
        </form>
    </React.Fragment >
);

export default PersonalDetailForm;
