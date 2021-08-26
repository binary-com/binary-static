import React from 'react';
import {
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressState,
    AddressPostcode,
} from '../../../_common/components/forms_common_rows.jsx';

const AddressDetailForm = () => (
    <form id='address_detail_step_form' className='gr-padding-10'>
        <div className='gr-padding-10 auto-margin gr-9 gr-12-m padding-h35'>
            <p className='hint no-margin'><strong>{it.L('Provide a valid address to verify your proof of residence.')}</strong></p>
            <p className='hint'>{it.L('Use the most recent bank statement or utility bill (e.g. electricity, water, gas, internet, landline except for mobile phone bills) that is no more than 6 months old and clearly shows your name and current address.')}</p>
        </div>
        <div className='gr-8 gr-12-m auto-margin' id='address_section' >
            <AddressLine1 row_id='address_line_1_row' row_class='invisible' />
            <AddressLine2 row_id='address_line_2_row' row_class='invisible' />
            <AddressCity row_id='address_city_row' row_class='invisible' />
            <AddressState row_id='address_state_row' row_class='invisible' />
            <AddressPostcode row_id='address_postcode_row' row_class=' invisible' is_full_width />
        </div>
        <div className='align-end' id='submit_section'>
            <a className='button button-secondary btn_cancel action_previous margin-v-10 inline-block-button' href='javascript:;'><span>{it.L('Previous')}</span></a>
            <button className='button margin-v-10' type='submit'>{it.L('Next')}</button>
        </div>
    </form>
);

export default AddressDetailForm;
