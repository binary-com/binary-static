/* eslint-disable */
import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const PepDeclaration = ({ is_new_flow, className, row_id }) => (
    <Fieldset
        legend={is_new_flow
            ? it.L('Real accounts are not available to politically exposed persons (PEPs).')
            : it.L('PEP Declaration')
        }
        className={`fieldset_margin_top ${className}`}
        id={row_id}
    >
        <div className='gr-12'>
            <p className='no-margin'>{is_new_flow
                ? it.L('A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.')
                : it.L('A PEP is an individual who is or has been entrusted with a prominent public function. This status extends to a PEP\'s relatives and close associates.')
            }
                {!is_new_flow && <span id='pep_declaration_note_toggle' className='toggle-arrow'>{it.L('Learn more')}</span>}
            </p>
            {!is_new_flow && <div id='pep_declaration_note' style={{ display: 'none' }}>
                <p>{it.L('A politically exposed person (PEP) is an individual who is or has been entrusted with a prominent public function. Family members and close associates of such individuals are also considered as PEPs. A PEP who has ceased to be entrusted with a prominent public function for at least 12 months no longer qualifies as a PEP.')}</p>
            </div>}
        </div>
        <div className='gr-padding-10 gr-12'>
            <input id='pep_declaration' type='checkbox' />
            <label htmlFor='pep_declaration'>
                {is_new_flow
                    ? it.L('I am not a PEP, and I have not been a PEP in the last 12 months.')
                    : it.L('I acknowledge that I am not a politically exposed person (PEP).')
                }
            </label>
            {!is_new_flow && <span className='required_field_asterisk'>*</span>}
        </div>
    </Fieldset>
);

export default PepDeclaration;
