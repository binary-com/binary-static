import React from 'react';
import FinancialInfoForm from '../_includes/new_account_steps/financial_info_form.jsx';
import CurrencyForm from '../_includes/new_account_steps/currency_form.jsx';
import PersonalDetailForm from '../_includes/new_account_steps/personal_detail_form.jsx';
import AddressDetailForm from '../_includes/new_account_steps/address_detail_form.jsx';
import TermsOfUseForm from '../_includes/new_account_steps/terms_of_use_form.jsx';
import Loading from '../../_common/components/loading.jsx';
import { ClientMessage } from '../../_common/components/forms_common_rows.jsx';

const RealAccount = () => (
    <React.Fragment>
        <div id='loading'>
            <Loading />
        </div>

        <div className='gr-12 static_full invisible' id='real_account_wrapper'>
            <div className='invisible' id='account_opening_steps'>
                <h1 id='page_title' />
                <div className='form-progress' id='form_progress' />
                <div className='invisible' id='currency_step'>
                    <CurrencyForm />
                </div>
                <div className='invisible' id='personal_detail_step'>
                    <PersonalDetailForm />
                </div>
                <div className='invisible' id='address_detail_step'>
                    <AddressDetailForm />
                </div>
                <div className='invisible' id='financial_info_step'>
                    <FinancialInfoForm />
                </div>
                <div className='invisible' id='terms_of_use_step'>
                    <TermsOfUseForm />
                </div>
            </div>
            <form className='gr-padding-10 gr-10 auto-margin invisible' id='financial_risk_warning'>
                <fieldset id={'Appropriateness'}>
                    <legend><strong>{it.L('WARNING')}</strong></legend>
                    <p className='gr-gutter'>{it.L('Our products and services may expose you to risks that can be substantial at times, including the risk of losing your entire investment. Please note that by clicking [_1]Continue[_2], you’ll be accepting these risks.', '<strong>', '</strong>')}</p>
                </fieldset>
                <div className='align-end'>
                    <button id='financial_risk_accept' className='button margin-v-10' type='submit' action='financial_risk_accept'>{it.L('Continue')}</button>
                </div>
            </form>
            <ClientMessage />
        </div>
    </React.Fragment>
);

export default RealAccount;
