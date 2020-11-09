import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';

const SelfExclusion = () => (
    <React.Fragment>
        <div className='invisible' id='description'>
            <h1>{it.L('Self-Exclusion')}</h1>
            <div data-show='iom'>
                <p>{it.L('Online trading can be addictive. Self-exclusion is a facility to limit your online trading activity, should you need it. You can set limits in your account to help prevent unwanted losses. If you are in the UK, your limits may be removed or increased within 24 hours.')}</p>
                <p>{it.L('If you are in the IOM, your limits may only be removed or increased, once the limit date setting has expired. [_1]Contact us[_2] to remove or adjust your limits.', `<a href="${it.url_for('contact')}">`, '</a>')}</p>
            </div>
            <div>
                <p data-show='svg'>{it.L('Online trading can be addictive. This self-exclusion page is where you manage your online trading activity and exercise [_1]responsible trading[_2].', `<a href="${it.url_for('responsible-trading')}">`, '</a>')}</p>
                <p data-show='maltainvest'>{it.L('Online trading can be addictive. Self-exclusion is a facility to limit your online trading activity, should you need it. You can set limits in your account to help prevent unwanted losses. You may adjust these limits any time, but remove them only after 24 hours. [_1]Contact us[_2] to remove or adjust your limits.', `<a href="${it.url_for('contact')}">`, '</a>')}</p>
            </div>
            <p data-show='eucountry'>{it.L('You may also instruct us to exclude you from trading on [_1] for a specific period of time. This self-exclusion date cannot be amended once it is set.', it.website_name)}</p>
            <p data-show='-eucountry'>{it.L('Here, you can set and adjust the amount of money and time you spend trading on SmartTrader, WebTrader, and Binary Bot. Setting your limits is optional and you can adjust them at any time. If you don’t wish to set a specific limit, leave the field blank.')}</p>
            <p data-show='-eucountry'>{it.L('You can also decide to exclude yourself entirely from our website for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our [_1]Customer Support[_2].', `<a href="${it.url_for('contact')}">`, '</a>')}</p>
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
                <FormRow type='text' id='max_balance' label={it.L('Maximum account cash balance')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Once this limit is reached, you may no longer deposit.')} />

                <div data-show='iom, malta, maltainvest' className='form-row no-padding'>
                    <FormRow type='text' id='max_deposit' label={it.L('Daily deposit limit')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Once this limit is reached, you may no longer deposit.')} />
                    <FormRow type='text' id='max_7day_deposit'  label={it.L('7-day deposit limit')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Once this limit is reached, you may no longer deposit.')} />
                    <FormRow type='text' id='max_30day_deposit' label={it.L('30-day deposit limit')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Once this limit is reached, you may no longer deposit.')} />
                </div>

                <FormRow type='text' id='max_turnover' label={it.L('Daily turnover limit')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Maximum aggregate contract purchases per day.')} />

                <FormRow type='text' id='max_7day_turnover' label={it.L('7-day turnover limit')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Maximum aggregate contract purchases over a 7-day period.')} />

                <FormRow type='custom' row_class='max_30day_turnover' label={it.L('30-day turnover limit')} hint={it.L('Maximum aggregate contract purchases over a 30-day period.')}>
                    <input id='max_30day_turnover' className='append_currency' type='text' maxLength={20} />
                    <div data-show='iom, malta' className=' gr-12-m gr-centered-m inline-flex'>
                        <input id='chk_no_limit' type='checkbox' />
                        <label htmlFor='chk_no_limit'>{it.L('No limit')}</label>
                    </div>
                </FormRow>

                <FormRow type='text' id='max_losses' label={it.L('Daily limit on losses')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Maximum aggregate loss per day.')} />

                <FormRow type='text' id='max_7day_losses' label={it.L('7-day limit on losses')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Maximum aggregate loss over a 7-day period.')} />

                <FormRow type='text' id='max_30day_losses' label={it.L('30-day limit on losses')} attributes={{ maxLength: 20 }} className='append_currency' hint={it.L('Maximum aggregate loss over a 30-day period.')} />

                <FormRow type='text' id='max_open_bets' label={it.L('Maximum number of open positions')} attributes={{ maxLength: 4 }} hint={it.L('Maximum number of contracts that can be open at the same time.')} />

                <FormRow type='text' id='session_duration_limit' label={it.L('Session duration limit, in minutes')} attributes={{ maxLength: 5 }} hint={it.L('You will be automatically logged out after such time.')} />

                <FormRow
                    type='custom'
                    id='timeout_until_date'
                    label={it.L('Time out until')}
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

                <div id='self_exclusion_warning' data-show='iom, malta' className='gr-row gr-padding-10 invisible'>
                    <div className='gr-8 gr-push-4 gr-12-m gr-push-0-m'>
                        <div className='notice-msg gr-child gr-parent'>
                            <p>{it.L('Self-exclusion on this website is applicable to your account only as accessed on [_1] or deriv.com and does not apply to any other website.', (it.website_name).toLowerCase())}</p>
                            <p data-show='malta'>{it.L('If you live in the United Kingdom and are considering self-exclusion, you may wish to register with GAMSTOP.')}</p>
                            <p data-show='iom'>{it.L('If you are considering self-exclusion, you may wish to register with GAMSTOP.')}</p>
                            <p>{it.L('GAMSTOP is a free service that enables you to self-exclude from all online gambling companies licensed in Great Britain. To find out more and to sign up, please visit [_1].', '<a target="_blank" rel="noopener noreferrer" href="https://www.gamstop.co.uk/">www.gamstop.co.uk</a>')}</p>
                            <p>{it.L('[_1]Please note that if you live in the United Kingdom, self-exclusion cannot be removed until its period has expired. [_2]If you wish to resume trading after your self-exclusion period is over, please make your request by calling [_3]. Requests by chat or email shall not be entertained.',
                                '<span data-show="malta">', '</span>', '<a href=\'call:+447723580049\'>+447723580049</a>')}
                            </p>
                            <p>{it.L('For more information about counselling and support services, please visit [_1].', '<a target="_blank" rel="noopener noreferrer" href="https://www.begambleaware.org/">begambleaware.org</a>')}</p>
                        </div>
                    </div>
                </div>

                <SubmitButton text={it.L('Update settings')} type='submit' />

            </Fieldset>
        </form>
    </React.Fragment>
);

export default SelfExclusion;
