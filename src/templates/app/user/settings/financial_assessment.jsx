import React from 'react';
import AuthenticateMessageFinancial from '../../_includes/authenticate_message_financial.jsx';
import FinancialForm from '../../_includes/financial_form.jsx';
import Loading from '../../../_common/components/loading.jsx';
import { SubmitButton } from '../../../_common/components/forms.jsx';

const FinancialAssessment = () => (
    <div>
        <h1 id='heading'>{it.L('Financial Assessment')}</h1>

        <div id='assessment_loading'>
            <Loading />
        </div>

        <div id='msg_main' className='invisible'>
            <p>{it.L('Thank you for completing the Financial Assessment and registering your Financial Account. You can now deposit funds and trade Forex with real money on MT5.')}</p>
            <div id='msg_authenticate' className='invisible'>
                <div><strong>{it.L('Important')}</strong></div>
                <AuthenticateMessageFinancial />
            </div>
            <div className='center-text'>
                <a className='button' href={it.url_for('user/metatrader')}>
                    <span>{it.L('MetaTrader account management')}</span>
                </a>
            </div>
        </div>

        <form className='invisible' id='frm_assessment'>
            <p className='invisible' id='high_risk_classification'>{it.L('Due to recent changes in the regulations, we are required to ask our clients to complete the following Financial Assessment. Please note that you will not be able to continue trading until this is completed.')}</p>

            <FinancialForm />

            <fieldset>
                <p className='gr-12'>{it.L('The financial trading services contained within this site are only suitable for customers who are able to bear the loss of all the money they invest and who understand and have experience of the risk involved in the acquistion of financial contracts. Transactions in financial contracts carry a high degree of risk. If purchased contracts expire worthless, you will suffer a total loss of your investment, which consists of the contract premium.')}</p>
            </fieldset>

            <SubmitButton text={it.L('Update')} is_centered type='submit' />
        </form>
    </div>
);

export default FinancialAssessment;
