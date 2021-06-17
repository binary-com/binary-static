import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const PepDeclaration = () => (
    <Fieldset legend={it.L('PEP Declaration')}>
        <div className='gr-12'>
            <label>{it.L('A PEP is an individual who is or has been entrusted with a prominent public function. This status extends to a PEP\'s relatives and close associates.')}&nbsp;
                <span id='pep_declaration_note_toggle' className='toggle-arrow'>{it.L('Learn more')}</span>
            </label>
            <div id='pep_declaration_note' style={{ display: 'none' }}>
                <p>{it.L('A politically exposed person (PEP) is an individual who is or has been entrusted with a prominent public function. Family members and close associates of such individuals are also considered as PEPs. A PEP who has ceased to be entrusted with a prominent public function for at least 12 months no longer qualifies as a PEP.')}</p>
            </div>
        </div>
        <div className='gr-padding-10 gr-12'>
            <input id='not_pep' type='checkbox' />
            <label htmlFor='not_pep'>
                {it.L('I acknowledge that I am not a politically exposed person (PEP).')}
            </label>
            <span className='required_field_asterisk'>*</span>
        </div>
    </Fieldset>
);

export default PepDeclaration;
