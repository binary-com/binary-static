import React                from 'react';
import FormVerificationCode from '../_includes/form_verification_code.jsx';
import {
    FormRow,
    Fieldset,
    SubmitButton }          from '../../_common/components/forms.jsx';
import { SeparatorLine }    from '../../_common/components/separator_line.jsx';

const ImportantDisclaimer = ({ className }) => (
    <p className={`disclaimer${ className || ''}`}><strong>{it.L('IMPORTANT DISCLAIMER')}</strong> - {it.L('[_1] is not affiliated with any of the Payment Agents listed above. Each Payment Agent operates as an independent service provider and is not endorsed, guaranteed or otherwise approved by [_1]. CUSTOMERS DEAL WITH PAYMENT AGENTS AT THEIR SOLE RISK AND PERIL. Customers are advised to check the credentials of Payment Agents before sending them any money. [_1] shall not in any circumstance be held responsible for transactions made between customers and Payment Agents.', it.website_name)}</p>
);

const PaymentAgentWithdraw = () => (
    <React.Fragment>
        <h1>{it.L('Payment Agent Withdrawal')}</h1>

        <div id='paymentagent_withdrawal'>
            <div id='viewError' className='viewItem invisible'>
                <p id='custom-error' className='notice-msg center-text invisible' />
                <p id='withdrawal-locked-error' className='notice-msg center-text invisible'>
                    {it.L('Withdrawal for your account is not allowed at this moment.')}
                </p>
            </div>

            <div id='viewNotice' className='viewItem invisible'>
                {it.L('Please check your email for the verification link to complete the process.')}
            </div>

            <div id='viewSuccess' className='viewItem invisible'>
                <Fieldset>
                    <div className='gr-row'>
                        <div className='gr-8 gr-12-m gr-centered gr-padding-30 gr-child center-text'>
                            <h2>{it.L('Your request is being processed.')}</h2>
                            <p id='successMessage' />
                        </div>
                    </div>

                    <div className='gr-row'>
                        <div className='gr-11 gr-centered'>
                            <SeparatorLine show_mobile />
                        </div>
                    </div>

                    <div className='gr-row'>
                        <div className='gr-8 gr-12-m gr-centered gr-padding-10 gr-child center-text'>
                            <p>{it.L('Please contact your payment agent to validate your withdrawal request.')}</p>
                        </div>
                    </div>

                    <div className='gr-row invisible' id='agentDetails'>
                        <div className='gr-push-3 gr-push-0-m gr-7 gr-12-m gr-padding-10'>
                            <div className='gr-row'>
                                <div className='gr-2 gr-3-m'>
                                    <img className='responsive' src={it.url_for('images/pages/contact/contact-icon.svg')} />
                                </div>
                                <div className='gr-10 gr-9-m'>
                                    <h5 id='agentName' />
                                    <h5 className='gr-padding-20 gr-child' id='agentWebsite'>
                                        {it.L('Website:')} <a />
                                    </h5>
                                    <h5 className='gr-padding-20 gr-child' id='agentEmail'>
                                        {it.L('Email:')} <a />
                                    </h5>
                                    <h5 className='gr-padding-20 gr-child' id='agentTelephone'>
                                        {it.L('Tel:')} <a />
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <ImportantDisclaimer className='gr-padding-30' />
            </div>

            <FormVerificationCode />

            <form id='viewConfirm' className='viewItem invisible'>
                <p>{it.L('Please confirm the transaction details in order to complete the transfer:')} </p>

                <p>
                    {it.L('Transfer to')}: <span id='lblAgentName' />
                    <br />
                    {it.L('Amount')}: <span id='lblAmount' /> <span id='lblCurrency' />
                    <br />
                    <span id='lblPaymentRefContainer' className='invisible'>
                        {it.L('Payment reference')}: <span id='lblPaymentRef' />
                    </span>
                </p>

                <SubmitButton
                    id='btn_transaction_detail'
                    custom_btn_id='btnBack'
                    custom_btn_href='javascript:;'
                    custom_btn_text={it.L('Back')}
                    type='submit'
                    text={it.L('Confirm')}
                    is_left_align
                />
            </form>

            <div id='viewForm' className='viewItem invisible'>
                <p>{it.L('Please provide us with the following information:')}</p>

                <form className='form gr-padding-10' id='frmWithdrawal'>
                    <Fieldset>
                        <FormRow label={it.L('Transfer funds to a payment agent')} type='custom' row_class='wrapper-row-agent'>
                            <div className='row-agent'>
                                <div>
                                    <select id='ddlAgents' className='form_input' />
                                </div>
                                <div>{it.L('or')}</div>
                                <div>
                                    <input id='txtAgents' type='text' className='form_input' maxLength='12' placeholder={it.L('Enter payment agent ID')} data-lpignore='true' />
                                    <div className='hint'>
                                        {it.L('If the payment agent is not listed, type in the payment agent ID. For example: CR000000.')}
                                    </div>
                                </div>
                                <p className='error-msg no-margin invisible'>This field is required.</p>
                            </div>
                        </FormRow>
                        <div className='gr-9 gr-centered'>
                            <SeparatorLine className='gr-padding-10' show_mobile />
                        </div>
                        <FormRow label={it.L('Amount')} id='txtAmount' type='text' />
                        <div className='gr-9 gr-centered'>
                            <SeparatorLine className='gr-padding-10' show_mobile />
                        </div>
                        <FormRow label={it.L('Payment reference')} id='txtPaymentRef' type='text' hint={it.L('If you have a payment reference (for example 122), you can enter it here.')} />
                        <p id='form-error' className='error-msg center-text invisible' />
                        <SubmitButton id='reference_btn_submit' msg_id='withdrawFormMessage' type='submit' text={it.L('Submit')} />
                        <div className='gr-8 gr-centered gr-padding-20'>
                            {it.L('Note: [_1] does not charge any transfer fees.', it.website_name)}
                        </div>
                    </Fieldset>
                </form>

                <ImportantDisclaimer />
            </div>
        </div>
    </React.Fragment>
);

export default PaymentAgentWithdraw;
