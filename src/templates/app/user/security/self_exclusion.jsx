import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';

const SelfExclusion = () => (
    <React.Fragment>
        <div className='invisible' id='description'>
            <h1>{it.L('Self-Exclusion Facilities')}</h1>
            <p>{it.L('Online trading can become addictive. Fill in the form below to limit your participation on the website or send a signed letter or fax to our customer support team. Once set, you can only tighten your limits. Limits will only be removed or loosened after 7 days with the exception of the self-exclusion date, which cannot be removed or altered once you have confirmed it. To remove or increase your limits, please contact <a href="[_1]">customer support</a>.', it.url_for('contact'))}</p>
        </div>
        <div className='invisible' id='description_max_30day_turnover'>
            <h1>{it.L('Turnover Limit')}</h1>
            <p>{it.L('In order to access the cashier, we kindly request that you set a 30-day turnover limit for your account. Turnover is the total aggregate amount that is used to open trades. Therefore, this limit should be set to the total volume that you wish to trade with over 30 days.')}</p>
        </div>

        <p id='msg_error' className='center-text notice-msg invisible' />

        <div id='loading'>
            <Loading />
        </div>

        <form id='frm_self_exclusion' className='invisible'>
            <Fieldset>
                <FormRow type='text' id='max_balance' label={it.L('Maximum account cash balance')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Once this limit is reached, you may no longer deposit.')} />

                <FormRow type='text' id='max_turnover' label={it.L('Daily turnover limit')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate contract purchases per day.')} />

                <FormRow type='text' id='max_losses' label={it.L('Daily limit on losses')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate loss per day.')} />

                <FormRow type='text' id='max_7day_turnover' label={it.L('7-day turnover limit')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate contract purchases over a 7-day period.')} />

                <FormRow type='text' id='max_7day_losses' label={it.L('7-day limit on losses')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate loss over a 7-day period.')} />

                <FormRow type='text' id='max_30day_turnover' row_class='max_30day_turnover' label={it.L('30-day turnover limit')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate contract purchases over a 30-day period.')} />

                <FormRow type='text' id='max_30day_losses' label={it.L('30-day limit on losses')} attributes={{ maxLength: 20 }} className='prepend_currency' hint={it.L('Maximum aggregate loss over a 30-day period.')} />

                <FormRow type='text' id='max_open_bets' label={it.L('Maximum number of open positions')} attributes={{ maxLength: 4 }} hint={it.L('Maximum number of contracts that can be open at the same time.')} />

                <FormRow type='text' id='session_duration_limit' label={it.L('Session duration limit, in minutes')} attributes={{ maxLength: 5 }} hint={it.L('You will be automatically logged out after such time.')} />

                <FormRow
                    type='custom'
                    id='timeout_until_date'
                    label={it.L('Time out until')}
                    row_class='ja-hide'
                    hint={it.L('Please enter date in the format DD MMM, YYYY HH:mm (local time).')}
                >
                    <div className='gr-row'>
                        <div className='gr-5 gr-6-t gr-12-p gr-12-m'>
                            <input type='text' className='clearable' id='timeout_until_date' maxLength='15' autoComplete='off' readOnly />
                        </div>
                        <div className='gr-4 gr-6-t gr-12-p gr-12-m'>
                            <input type='text' className='clearable' id='timeout_until_time' maxLength='8' autoComplete='off' />
                        </div>
                    </div>
                </FormRow>

                <FormRow type='text' id='exclude_until' label={it.L('Exclude me from the website until')} attributes={{ maxLength: 15, autoComplete: 'off', readOnly: 'readonly' }} className='clearable' hint={it.L('Please enter date in the format DD MMM, YYYY.')} />

                <SubmitButton text={it.L('Update Settings')} type='submit' />
            </Fieldset>
        </form>
    </React.Fragment>
);

export default SelfExclusion;
