import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const PepDeclaration = ({ className, row_id }) => (
    <Fieldset
        legend={it.L('Real accounts are not available to politically exposed persons (PEPs).')}
        className={`fieldset_margin_top ${className}`}
        id={row_id}
    >
        <div className='gr-12'>
            {/* <p>{it.L('A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.')}</p> */}
            <label>{it.L('A PEP is an individual who is or has been entrusted with a prominent public function. This status extends to a PEP\'s relatives and close associates.')}&nbsp;
                <span id='pep_declaration_note_toggle' className='toggle-arrow'>{it.L('Learn more')}</span>
            </label>
            <div id='pep_declaration_note' style={{ display: 'none' }}>
                <p>{it.L('A politically exposed person (PEP) is an individual who is or has been entrusted with a prominent public function. Family members and close associates of such individuals are also considered as PEPs. A PEP who has ceased to be entrusted with a prominent public function for at least 12 months no longer qualifies as a PEP.')}</p>
            </div>
        </div>
        <div className='gr-padding-10 gr-12'>
            <input id='pep_declaration' type='checkbox' />
            <label htmlFor='pep_declaration'>
                {it.L('I am not a PEP, and I have not been a PEP in the last 12 months.')}
            </label>
            <span className='required_field_asterisk'>*</span>
        </div>
    </Fieldset>
);

export default PepDeclaration;
