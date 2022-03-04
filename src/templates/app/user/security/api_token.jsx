import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';

const ApiToken = () => (
    <React.Fragment>
        <div id='api_token' className='api_token'>
            <h1>{it.L('API Token')}</h1>

            <p>{it.L('In order to access our mobile apps and other third-party applications, you\'ll first need to generate an API Token.')}</p>
            <ul className='bullet'>
                <li>{it.L('Simply click on "Create" to generate your token; then copy and paste it into the app.')}</li>
                <li>{it.L('Choose the specific type of API token that you need, based on the capabilities that you wish to make available.')}</li>
            </ul>

            <div id='token_form' className='gr-12 gr-padding-10'>
                <form>
                    <Fieldset legend={it.L('Create new token')}>
                        <FormRow label_row_cell_width={1} label_row_class='title-align' row_class='title-row' sub_row_class='input-area' type='text' id='txt_name' label={it.L('Title')} attributes={{ maxLength: 32 }} />

                        <FormRow label_row_cell_width={2} label_row_class='choose-scopes-align' sub_row_class='scope-types' type='custom' label={it.L('Choose scopes:')}>

                            <div className='scope-item'>
                                <input id='chk_scopes_read' type='checkbox' value='read' checked='checked' readOnly='readonly' />
                                <label htmlFor='chk_scopes_read'>{it.L('Read')}</label>
                                <span className='scope-item-description'>{it.L('Can be used to view account activity, including settings, limits, balance sheets, trade purchase history, and more.')}</span>
                            </div>
                            <div className='scope-item'>
                                <input id='chk_scopes_trade' type='checkbox' value='trade' />
                                <label htmlFor='chk_scopes_trade'>{it.L('Trade')}</label>
                                <span className='scope-item-description'>{it.L('Can be used to buy and sell contracts, renew expired purchases, and top-up demo accounts.')}</span>
                            </div>
                            <div className='scope-item'>
                                <input id='chk_scopes_payments' type='checkbox' value='payments' />
                                <label htmlFor='chk_scopes_payments'>{it.L('Payments')}</label>
                                <span className='scope-item-description'>{it.L('Can be used to withdraw to payment agents and transfer funds between accounts.')}</span>
                            </div>
                            <div className='scope-item'>
                                <input id='chk_scopes_admin' type='checkbox' value='admin' />
                                <label>{it.L('Admin')}</label>
                                <span className='scope-item-description'>{it.L('Can be used to open accounts, set settings, manage token usage, and more.')}</span>
                            </div>
                            <div className='scope-item'>
                                <input id='chk_scopes_trading_information' type='checkbox' value='trading_information' />
                                <label htmlFor='chk_scopes_trading_information'>{it.L('Trading information')}</label>
                                <span className='scope-item-description'>{it.L('Can be used to view the trading history of an account.')}</span>
                            </div>
                        </FormRow>

                        <SubmitButton is_left_align left_alignment_size={2} text={it.L('Create')} type='submit' />
                    </Fieldset>
                </form>
            </div>

            <div id='token_message' className='gr-12 gr-padding-10 center-text invisible'>
                <p />
            </div>

            <div id='tokens_list' className='gr-12 gr-parent gr-padding-10'><Loading /></div>
        </div>
    </React.Fragment>
);

export default ApiToken;
