import React from 'react';
import ProfessionalClient from '../../_includes/professional_client.jsx';
import Loading from '../../../_common/components/loading.jsx';
import { SubmitButton } from '../../../_common/components/forms.jsx';

const Professional = () => (
    <div className='container'>
        <div className='static_full'>
            <h1>{it.L('Professional Trader')}</h1>

            <div id='loading'>
                <Loading />
            </div>

            <form className='form gr-padding-10 invisible' id='frm_professional'>
                <ProfessionalClient />

                <SubmitButton msg_id='form_message' type='submit' text={it.L('Submit')} />
            </form>
        </div>
    </div>
);

export default Professional;
