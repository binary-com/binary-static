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
            <h1 id='page_title' />
            <div className='invisible' id='account_opening_steps'>
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
            <form className='gr-padding-10 invisible' id='financial_risk_warning'>
                <p><strong>{it.L('Appropriateness Test: WARNING:')}</strong></p>
                <p>{it.L('In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you (that is, whether you possess the experience and knowledge to understand the risks involved).')}</p>
                <p>{it.L('On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.')}</p>
                <p>{it.L('By clicking <strong>Accept</strong> below and proceeding with the Account Opening you should note that you may be exposing yourself to risks (which may be significant, including the risk of loss of the entire sum invested) that you may not have the knowledge and experience to properly assess or mitigate.')}</p>
                <div className='align-end' id='submit_section'>
                    <a id='financial_risk_decline' className='button button-secondary btn_cancel margin-v-10 inline-block-button' href={it.url_for('trading')}><span>{it.L('Decline')}</span></a>
                    <button id='financial_risk_accept' className='button margin-v-10' type='submit' action='financial_risk_accept'>{it.L('Accept')}</button>
                </div>
            </form>
            <ClientMessage />
        </div>
    </React.Fragment>
);

export default RealAccount;
