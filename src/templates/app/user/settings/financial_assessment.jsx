import React from 'react';
import AuthenticateMessageFinancial from '../../_includes/authenticate_message_financial.jsx';
import FinancialForm from '../../_includes/financial_form.jsx';
import Loading from '../../../_common/components/loading.jsx';
import { SubmitButton } from '../../../_common/components/forms.jsx';
import { RiskDisclaimer } from '../../../_common/components/forms_common_rows.jsx';

const FinancialAssessment = () => (
    <div>
        <h1 id='heading'>{it.L('Financial Assessment')}</h1>

        <div id='assessment_loading'>
            <Loading />
        </div>

        <div id='msg_main' className='invisible'>
            <p>{it.L('Thank you for completing the Financial Assessment. You can now deposit funds and trade Forex with real money on MetaTrader 5.')}</p>
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

        <form className='invisible' id='frm_assessment'>
            <p className='invisible' id='high_risk_classification'>{it.L('Due to recent changes in the regulations, we are required to ask our clients to complete the following Financial Assessment. Please note that you will not be able to continue trading until this is completed.')}</p>

            <FinancialForm />

            <div className='invisible' id='risk_disclaimer'>
                <RiskDisclaimer />
            </div>

            <SubmitButton text={it.L('Update')} is_centered type='submit' />
        </form>
    </div>
);

export default FinancialAssessment;
