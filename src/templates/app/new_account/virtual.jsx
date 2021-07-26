import React from 'react';
import { FormRow, Fieldset } from '../../_common/components/forms.jsx';
import FormVerificationCode from '../_includes/form_verification_code.jsx';

const Virtual = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Create New Demo Account')}</h1>

        <FormVerificationCode />

        <form id='virtual-form' className='gr-padding-10 invisible'>
            <Fieldset legend={it.L('Details')}>
                <FormRow type='select' id='residence' className='invisible' label={it.L('Country of residence')} attributes={{ single: 'single' }} />
                <FormRow
                    autoComplete='new-password'
                    type='password'
                    has_password_meter
                    id='client_password'
                    label={it.L('New password')}
                />

                <div className='gr-8 gr-push-4 gr-12-m gr-push-0-m center-text-m'>
                    <p className='hint password--hint'>
                        {it.L('Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.')}
                    </p>
                </div>
            </Fieldset>
            <div id='consent_checkbox' className='email-consent-container'>
                <FormRow
                    type='checkbox'
                    id='email_consent'
                    label_row_id='email_consent_label'
                    label={it.L('I want to receive updates on [_1] products, services, and events.', it.website_name)}
                />
            </div>
            <div className='center-text'>
                <button className='button' type='submit'>{it.L('Create new demo account')}</button>
                <p className='errorfield invisible' id='error-account-opening' />
            </div>
        </form>
    </div>
);

export default Virtual;
