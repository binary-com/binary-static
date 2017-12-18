/* eslint-disable no-script-url, no-unused-vars, import/no-extraneous-dependencies */
import React from 'react';
import {FormRow, SubmitButton, Fieldset} from '../../_common/components/forms.jsx';


const Row = ({id}) => (
    <div class="gr-padding-10 gr-row table-body">
        <div class="gr-1"></div>
        <div>
            <span id={`${id}_loginid`}></span>
        </div>
        <div class="gr-5">
            <span id={`${id}_balance`}></span>
        </div>
    </div>
 );

const AccountTransfer = () => <React.Fragment>
    <h1>{it.L('Transfer Between Accounts')}</h1>

    <div class="invisible" id="client_message">
        <p class="center-text notice-msg">
            <span class="invisible" id="no_account">{it.L('Fund transfers between accounts are unavailable.')}</span>
            <span class="invisible" id="not_enough_balance">
                {it.L('The minimum required amount for using the account transfer facility is [_1].', '<span id="min_required_amount"></span>')}
            </span>
            <span class="invisible" id="no_balance">
                {it.L('Please [_1]deposit[_2] to your account.', `<a href="${it.url_for('/cashier/forwardws#deposit')}">`, '</a>')}
            </span>
            <span class="invisible" id="limit_reached">{it.L('You have reached your withdrawal limit.')}</span>
        </p>
    </div>

    <div class="invisible" id="error_message">
        <p class="center-text notice-msg"></p>
    </div>

    <div class="invisible" id="success_form">
        <p>{it.L('Your fund transfer is successful. Your new balances are:')}</p>
        <Row id='from' />
        <Row id='to' />
    </div>

    <form class="invisible" id="frm_account_transfer">
        <p>{it.L('Transfer funds between your real money accounts.')}</p>

        <Fieldset legend={it.L('Details')}>
            <FormRow label={it.L('Transfer from')} type='label'  id='lbl_transfer_from' />
            <FormRow label={it.L('Transfer to')}   type='select' id='transfer_to' />
            <FormRow label={it.L('Amount')}        type='custom' id='transfer_amount'>
                <label id="currency"></label>
                <input id="amount" name="amount" type="text" maxlength="20" autocomplete="off" />
                <div class="hint" id="range_hint"></div>
            </FormRow>
        </Fieldset>

        <SubmitButton msg_id='form_error' type='submit' text={it.L('Transfer')} />
    </form>

    <div class="hint invisible" id="transfer_fee">
        <p>{it.L('Note: You may only transfer funds between a fiat account and a cryptocurrency account.')}</p>
        <p>{it.L('Transfer funds between your fiat and cryptocurrency accounts for a fee:')}</p>
        <ul class="bullet">
            <li>{it.L('From fiat to cryptocurrency: [_1] transfer fee', '1%')}</li>
            <li>{it.L('From cryptocurrency to fiat: [_1] transfer fee', '1%')}</li>
        </ul>
    </div>
</React.Fragment>;

export default AccountTransfer;