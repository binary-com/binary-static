import React from 'react';
import {SubmitButton} from '../../_common/components/forms.jsx';

const AccountType = () => (
<div id='account_type_container' className='invisible'>
    <h1>{it.L('Select account type')}</h1>

    <p>{it.L('Please select the type of account you wish to create.')}</p>

    <div className='gr-row form-row'>
        <div className='gr-1 gr-12-m align-end'>
            <input type='radio' defaultChecked name='account_type' id='account_type_default' value='default' />
        </div>
        <div className='gr-8 gr-12-m'>
            <label htmlFor='account_type_default'>
                {it.L('Create a standard real money account to trade on [_1]', it.website_name)}
            </label>
        </div>
    </div>
    <div className='gr-row form-row'>
        <div className='gr-1 gr-12-m align-end'>
            <input type='radio' name='account_type' id='account_type_ico' value='ico' />
        </div>
        <div  className='gr-8 gr-12-m'>
            <label htmlFor='account_type_ico'>
                {it.L('Create an ICO account to take part in our token sale only. <a href="[_1]" target="_blank">Learn more</a>', it.url_for('ico'))}
            </label>
        </div>
    </div>

    <SubmitButton is_centered={1} text={it.L('Next')} />
</div>
);

export default AccountType;
