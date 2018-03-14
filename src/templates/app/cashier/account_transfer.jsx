import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../_common/components/forms.jsx';

const Row = ({ id }) => (
    <div className='gr-padding-10 gr-row'>
        <div className='gr-2 align-end'>
            <span id={`${id}_loginid`} />
        </div>
        <div className='gr-10'>
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
                    <label id='currency' />
                    <input id='amount' name='amount' type='text' maxLength='20' autoComplete='off' />
                    <div className='hint' id='range_hint' />
                </FormRow>
            </Fieldset>

            <SubmitButton msg_id='form_error' type='submit' text={it.L('Transfer')} />
        </form>

        <div className='hint invisible' id='transfer_fee'>
            <p>{it.L('Note: You may only transfer funds between a fiat account and a cryptocurrency account.')}</p>
            <p>{it.L('Transfer funds between your fiat and cryptocurrency accounts for a fee:')}</p>
            <ul className='bullet'>
                <li>{it.L('From fiat to cryptocurrency: [_1] transfer fee', '1%')}</li>
                <li>{it.L('From cryptocurrency to fiat: [_1] transfer fee', '1%')}</li>
            </ul>
        </div>
    </React.Fragment>
);

export default AccountTransfer;
