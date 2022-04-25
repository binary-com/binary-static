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
                        <FormRow is_simple_row row_class='title-row' type='text' id='txt_name' label={it.L('Title')} attributes={{ maxLength: 32 }} />

                        <FormRow label_row_cell_width={2} row_class='scopes-row' label_row_class='scopes-title' sub_row_class='scope-types' type='custom' label={it.L('Choose scopes:')}>

                            <input id='chk_scopes_read' type='checkbox' value='read' checked='checked' readOnly='readonly' />
                            <label htmlFor='chk_scopes_read' className='scope-item'>
                                <span>{it.L('Read')}</span>
                                <div className='scope-item-description'>
                                    {it.L('View account activity such as settings, limits, balance sheets, trade purchase history, and more.')}
                                </div>
                            </label>

                            <input id='chk_scopes_trade' type='checkbox' value='trade' />
                            <label htmlFor='chk_scopes_trade' className='scope-item'>
                                <span>{it.L('Trade')}</span>
                                <div className='scope-item-description'>
                                    {it.L('Buy and sell contracts, renew expired purchases, and top up demo accounts.')}
                                </div>
                            </label>

                            <input id='chk_scopes_payments' type='checkbox' value='payments' />
                            <label htmlFor='chk_scopes_payments' className='scope-item'>
                                <span>{it.L('Payments')}</span>
                                <div className='scope-item-description'>
                                    {it.L('Withdraw to payment agents, and transfer funds between accounts.')}
                                </div>
                            </label>

                            <input id='chk_scopes_admin' type='checkbox' value='admin' />
                            <label htmlFor='chk_scopes_admin' className='scope-item'>
                                <span>{it.L('Admin')}</span>
                                <div className='scope-item-description'>
                                    {it.L('Open accounts, manage settings, manage token usage, and more.')}
                                </div>
                            </label>

                            <input id='chk_scopes_trading_information' type='checkbox' value='trading_information' />
                            <label htmlFor='chk_scopes_trading_information' className='scope-item'>
                                <span>{it.L('Trading information')}</span>
                                <div className='scope-item-description'>
                                    {it.L('View the trading history.')}
                                </div>
                            </label>

                        </FormRow>

                        <SubmitButton no_wrapper text={it.L('Create')} type='submit' />
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
