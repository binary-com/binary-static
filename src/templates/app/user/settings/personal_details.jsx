import React from 'react';
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

const Money = () => (
    <React.Fragment>
        <option value='Less than 1 million JPY'>{it.L('Less than 1 million JPY')}</option>
        <option value='1-3 million JPY'>{it.L('1-3 million JPY')}</option>
        <option value='3-5 million JPY'>{it.L('3-5 million JPY')}</option>
        <option value='5-10 million JPY'>{it.L('5-10 million JPY')}</option>
        <option value='10-30 million JPY'>{it.L('10-30 million JPY')}</option>
        <option value='30-50 million JPY'>{it.L('30-50 million JPY')}</option>
        <option value='50-100 million JPY'>{it.L('50-100 million JPY')}</option>
        <option value='Over 100 million JPY'>{it.L('Over 100 million JPY')}</option>
    </React.Fragment>
);

const Experience = () => (
    <React.Fragment>
        <option value='No experience'>{it.L('No experience')}</option>
        <option value='Less than 6 months'>{it.L('Less than 6 months')}</option>
        <option value='6 months to 1 year'>{it.L('6 months to 1 year')}</option>
        <option value='1-3 years'>{it.L('1-3 years')}</option>
        <option value='3-5 years'>{it.L('3-5 years')}</option>
        <option value='Over 5 years'>{it.L('Over 5 years')}</option>
    </React.Fragment>
);

const PersonalDetails = () => (
    <React.Fragment>
        <h1>{it.L('Personal Details')}</h1>

        <p className='notice-msg center-text invisible' id='tax_information_notice'>
            {it.L('Please complete the tax information before proceeding.')}
        </p>

        <p className='notice-msg center-text invisible' id='account_opening_reason_notice'>
            {it.L('Please set your account opening reason before proceeding.')}
        </p>

        <div id='loading'>
            <Loading />
        </div>

        <form className='form gr-padding-10 invisible' id='frmPersonalDetails'>
            <Fieldset legend={it.L('Details')}>
                <FormRow type='label' label={it.L('Name')} is_bold id='lbl_name' row_class='invisible' row_id='row_name' />
                <FormRow type='label' label={it.L('Gender')} is_bold id='lbl_gender' row_class='invisible JpAcc' />
                <FormRow type='label' label={it.L('Date of birth')} is_bold id='lbl_date_of_birth' row_class='invisible RealAcc JpAcc' />
                <FormRow type='label' label={it.L('Place of birth')} id='lbl_place_of_birth' row_id='row_lbl_place_of_birth' row_class='invisible' />
                <FormRow type='select' label={it.L('Place of birth')} id='place_of_birth' row_id='row_place_of_birth' row_class='invisible' />
                <FormRow type='label' label={it.L('Country of Residence')} is_bold id='lbl_country' row_id='row_country' />
                <FormRow type='label' label={it.L('Email address')} is_bold id='lbl_email' row_id='row_email' />
                <FormRow type='label' label={it.L('Account Opening Reason')} id='lbl_account_opening_reason' row_id='row_lbl_account_opening_reason' row_class='invisible' />
                <AccountOpeningReason row_id='row_account_opening_reason' row_class='invisible' />
                <FormRow type='select' label={it.L('Occupation')} id='occupation' className='jp_value' row_class='invisible JpAcc'>
                    <option value='Office worker'>{it.L('Office worker')}</option>
                    <option value='Director'>{it.L('Director')}</option>
                    <option value='Public worker'>{it.L('Public worker')}</option>
                    <option value='Self-employed'>{it.L('Self-employed')}</option>
                    <option value='Housewife / Househusband'>{it.L('Housewife / Househusband')}</option>
                    <option value='Contract / Temporary / Part Time'>{it.L('Contract / Temporary / Part Time')}</option>
                    <option value='Student'>{it.L('Student')}</option>
                    <option value='Unemployed'>{it.L('Unemployed')}</option>
                    <option value='Others'>{it.L('Others')}</option>
                </FormRow>
            </Fieldset>

            <Fieldset id='tax_information_form' className='invisible RealAcc ja-hide' legend={it.L('Tax Information')}>
                <TaxInformationForm />
            </Fieldset>

            <Fieldset id='address_form' className='invisible RealAcc ja-hide' legend={it.L('Address')}>
                <p className='hint'>{it.L('Please enter your full address to avoid authentication delays.')}</p>
                <AddressLine1 no_hint />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode />
                <Phone />
                <GeocodeResponse />
            </Fieldset>

            <Fieldset id='address_form' className='invisible JpAcc' legend={it.L('Address')}>
                <FormRow type='label' label={it.L('Postal Code / ZIP')} id='lbl_address_postcode' attributes={{className: 'jp_value'}} />
                <FormRow type='label' label={it.L('State/Province')} id='lbl_address_state' attributes={{className: 'jp_value'}} />
                <FormRow type='label' label={it.L('Town/City')} id='lbl_address_city' attributes={{className: 'jp_value'}} />
                <FormRow type='label' label={it.L('First line of home address')} id='lbl_address_line_1' attributes={{className: 'jp_value'}} />
                <FormRow type='label' label={it.L('Second line of home address')} id='lbl_address_line_2' attributes={{className: 'jp_value'}} />
                <FormRow type='label' label={it.L('Telephone')} id='lbl_phone' attributes={{className: 'jp_value'}} />
            </Fieldset>

            <Fieldset className='invisible JpAcc' legend={it.L('Status')}>
                <FormRow type='select' label={it.L('Annual income')} id='annual_income' className='jp_value'>
                    <Money />
                </FormRow>
                <FormRow type='select' label={it.L('Financial asset')} id='financial_asset' className='jp_value'>
                    <Money />
                </FormRow>
                <FormRow
                    type='label'
                    id='daily_loss_limit'
                    label={it.L('Daily limit on losses')}
                    attributes={{ className: 'jp_value format_money' }}
                    hint={it.L('Maximum aggregate loss per day. Update this value in our [_1]self exclusion facility[_2].', `<a href="${it.url_for('user/security/self_exclusionws#max_losses')}">`, '</a>')}
                />
            </Fieldset>

            <Fieldset className='invisible JpAcc' legend={it.L('Trading Experience')}>
                <FormRow type='select' label={it.L('Equities')} id='trading_experience_equities' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Commodities')} id='trading_experience_commodities' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Foreign currency deposit')} id='trading_experience_foreign_currency_deposit' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Margin FX')} id='trading_experience_margin_fx' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Investment trust')} id='trading_experience_investment_trust' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Public and corporation bond')} id='trading_experience_public_bond' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('OTC Derivative (Option) Trading')} id='trading_experience_option_trading' className='jp_value'>
                    <Experience />
                </FormRow>
                <FormRow type='select' label={it.L('Purpose of trading')} id='trading_purpose' className='jp_value'>
                    <option value='Targeting short-term profits'>{it.L('Targeting short-term profits')}</option>
                    <option value='Targeting medium-term / long-term profits'>{it.L('Targeting medium-term / long-term profits')}</option>
                    <option value='Both the above'>{it.L('Both the above')}</option>
                    <option value='Hedging'>{it.L('Hedging')}</option>
                </FormRow>
                <FormRow type='select' label={it.L('Classification of assets requiring hedge')} id='hedge_asset' className='jp_value' row_class='hedge invisible'>
                    <option value='Foreign currency deposit'>{it.L('Foreign currency deposit')}</option>
                    <option value='Margin FX'>{it.L('Margin FX')}</option>
                    <option value='Other'>{it.L('Other')}</option>
                </FormRow>
                <FormRow type='text' label={it.L('Amount of above assets')} id='hedge_asset_amount' attributes={{ maxLength: 20 }} row_class='hedge invisible' input_prefix='¥' />
                <FormRow type='select' id='motivation_circumstances' label={it.L('Motivation/Circumstances')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='Web Advertisement'>{it.L('Web Advertisement')}</option>
                    <option value='Homepage'>{it.L('Homepage')}</option>
                    <option value='Introduction by acquaintance'>{it.L('Introduction by acquaintance')}</option>
                    <option value='Others'>{it.L('Others')}</option>
                </FormRow>
            </Fieldset>

            <Fieldset className='invisible' id='fieldset_email_consent' legend={it.L('Preferences')}>
                <FormRow type='checkbox' label={it.L('Receive news and special offers')} id='email_consent' label_row_id='email_consent_label' />
            </Fieldset>

            <SubmitButton id='btn_update' className='invisible' msg_id='formMessage' type='submit' text={it.L('Update')} />
        </form>

        <p className='required invisible RealAcc JpAcc rowCustomerSupport'>{it.L('To change your name, date of birth, country of residence, or email, please contact <a href="[_1]">Customer Support</a>.', it.url_for('contact'))}</p>
    </React.Fragment>
);

export default PersonalDetails;
