import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../_common/components/forms.jsx';

const Row = ({ id }) => (
    <div className='gr-padding-10 gr-row'>
        <div className='gr-2 gr-4-m align-end'>
            <span id={`${id}_loginid`} />
        </div>
        <div className='gr-10 gr-8-m'>
            <span id={`${id}_currency`} />&nbsp;<span id={`${id}_balance`} />
        </div>
    </div>
);

const AccountTransfer = () => (
    <React.Fragment>
        <h1>{it.L('Transfer Between Accounts')}</h1>

        <div className='invisible' id='client_message'>
            <p className='center-text notice-msg'>
                <span className='invisible' id='no_account'>{it.L('Fund transfers between accounts are unavailable.')}&nbsp;</span>
                <span className='invisible' id='not_enough_balance'>
                    {it.L('The minimum required amount for using the account transfer facility is [_1].', '<span id="min_required_amount"></span>')}
                    &nbsp;
                </span>
                <span className='invisible' id='no_balance'>
                    {it.L('Please [_1]deposit[_2] to your account.', `<a href='${it.url_for('cashier/forwardws?action=deposit')}'>`, '</a>')}
                    &nbsp;
                </span>
                <span className='invisible' id='limit_reached'>{it.L('You have reached your withdrawal limit.')}&nbsp;</span>
            </p>
        </div>

        <div className='invisible' id='error_message'>
            <p className='center-text notice-msg' />
        </div>

        <div className='invisible' id='success_form'>
            <p>{it.L('Your fund transfer is successful. Your new balances are:')}</p>
            <Row id='from' />
            <Row id='to' />
            <p>
                <a href='javascript:;' id='reset_transfer'>{it.L('Make another transfer')}</a>
            </p>
        </div>

        <form className='invisible' id='frm_account_transfer'>
            <p>{it.L('Transfer funds between your real money accounts.')}</p>

            <Fieldset legend={it.L('Details')}>
                <FormRow label={it.L('Transfer from')} type='label'  id='lbl_transfer_from' />
                <FormRow label={it.L('Transfer to')}   type='select' id='transfer_to' />
                <FormRow label={it.L('Amount')}        type='custom' id='transfer_amount'>
                    <input id='amount' name='amount' type='text' maxLength='20' autoComplete='off' />
                </FormRow>
                <div className='gr-row'>
                    <div className='gr-4 gr-12-m' />
                    <div className='gr-8 gr-12-m'>
                        <div className='account_transfer font-s' id='range_hint'>
                            <h3 className='account_transfer__header'>
                                {it.L('Min')}: <span id='range_hint_min' />
                                &nbsp;{it.L('Max')}: <span id='range_hint_max' />
                            </h3>
                            <div>
                                <p className='explain-dynamic-limit font-s'>
                                    {it.L('Maximum transferable amount will be chosen from a minimum value of:')}
                                </p>
                                <ul className='bullet font-s'>
                                    <li>{it.L('Current balance: [_1]', '<span id=\'limit_current_balance\' />')}</li>
                                    <li>{it.L('Daily withdrawal limit: [_1]', '<span id=\'limit_daily_withdrawal\' />')}</li>
                                    <li>{it.L('Maximum allowed amount: [_1]', '<span id=\'limit_max_amount\' />')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Fieldset>

            <SubmitButton msg_id='form_error' type='submit' text={it.L('Transfer')} />
        </form>

        <div className='hint invisible' id='transfer_info'>
            <p>{it.L('Note: Transfer between accounts is not available on weekends.')}</p>
        </div>

        <div className='hint invisible' id='transfer_fee'>
            {it.L('Notes:')}
            <ul className='bullet'>
                <li>{it.L('Transfer between accounts is not available on weekends')}</li>
                <li>{it.L('You may only transfer funds between a fiat account and a cryptocurrency account')}</li>
                <li>{it.L('Each transfer is subject to a [_1] transfer fee or a minimum fee of [_2], whichever is higher.', '<span id="transfer_fee_amount"></span>', '<span id="transfer_fee_minimum"></span>')}</li>
                <li>{it.L('Authorised payment agents are exempted from paying any transfer fees')}</li>
            </ul>
        </div>
    </React.Fragment>
);

export default AccountTransfer;
