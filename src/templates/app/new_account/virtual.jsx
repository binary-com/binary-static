import React from 'react';
import { FormRow, Fieldset } from '../../_common/components/forms.jsx';

const Virtual = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Create New Account')}</h1>
        <form id='virtual-form' className='gr-padding-10 ja-hide'>
            <Fieldset legend={it.L('Details')}>
                <FormRow
                    type='password'
                    id='client_password'
                    label={it.L('Choose a password')}
                    hint={it.L('Minimum of six lower and uppercase letters with numbers')}
                />

                <FormRow type='password' id='repeat_password' label={it.L('Re-enter password')} />

                <FormRow type='select' id='residence' className='invisible' label={it.L('Country of residence')} attributes={{single: 'single'}}  />

                <FormRow
                    type='checkbox'
                    id='email_consent'
                    label_row_id='email_consent_label'
                    label={it.L('Yes, I would like to receive emails on Binary.com products, services, and events. I understand that I can unsubscribe from these emails at any time from my profile settings.')}
                />

                <div>
                    {it.L('By creating my account, I confirm that I’ve read and agree to your [_1]Terms & Conditions[_2] and [_3]Privacy Policy[_4]',
                            `<a href="${it.url_for('terms-and-conditions')}" target="_blank">`,
                            '</a>',
                            `<a href="${it.url_for('terms-and-conditions#privacy')}" target="_blank">`,
                            '</a>',
                    )}
                </div>
            </Fieldset>

            <div className='center-text'>
                <button className='button' type='submit'>{it.L('Create New Account')}</button>
                <p className='errorfield invisible' id='error-account-opening' />
            </div>
        </form>
        <div className='invisible ja-show'>
            <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
        </div>
    </div>
);

export default Virtual;
