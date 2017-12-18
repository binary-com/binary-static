/* eslint-disable no-script-url, no-unused-vars, import/no-extraneous-dependencies */
import React from 'react';
import {FormRow} from '../../_common/components/forms.jsx';

const Confirmation = () => (
    <div id="confirm_content" class="gr-padding-30 gr-gutter">
        <div class="gr-gutter">
            <div class="gr-gutter">
                <h1>{it.L('Alert')}</h1>
                <p class="gr-padding-10 gr-child no-margin">{it.L('Do not send Bitcoin to a Bitcoin Cash account (or Bitcoin Cash to a Bitcoin account). Doing so may lead to the loss of your funds.')}</p>
                <form id="frm_confirm">
                    <FormRow type='checkbox' label={it.L('Yes, I understand')} id='chk_confirm' />
                    <div class="center-text gr-centered">
                        <button class="button" type="submit">{it.L('Proceed')}</button>
                        <a class="button-secondary" id="cancel" href="javascript:;"><span>{it.L('Cancel')}</span></a>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

export default Confirmation;