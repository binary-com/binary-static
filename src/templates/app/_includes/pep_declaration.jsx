import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const PepDeclaration = () => (
    <Fieldset legend={it.L('PEP Declaration')}>
        <div className='gr-12'>
            <p>{it.L('A PEP is an individual who is or has been entrusted with a prominent public function. This status extends to a PEP\'s relatives and close associates.')}</p>
        </div>

        <div className='gr-padding-10 gr-12'>
            <input id='not_pep' type='checkbox' />
            <label htmlFor='not_pep'>
                {it.L('I acknowledge that I am not a politically exposed person (PEP).')}&nbsp;
                <span data-balloon-length='xlarge' data-balloon={it.L('A Politically Exposed Person (PEP) is an individual who is or has been entrusted with a prominent public function including his/her immediate family members or persons known to be close associates of such persons, but does not include middle ranking or more junior officials. Such individuals include Heads of State, Ministers, Parliamentary Secretaries, Members of Parliament, Judges, Ambassadors, Senior Government Officials, High Ranking Officers in the Armed Forces, Audit Committees of the boards of central banks, and Directors of state-owned corporations. The “immediate family members” of the above examples will also be considered as PEP, and these include their spouses/partners, parents, and children. Additionally, “persons known to be close associates” of PEPs include their business partners, will also be considered as such. As a general rule, a person considered to be a PEP and who has ceased to be entrusted with a prominent public function for a period of at least twelve months no longer qualifies as a PEP.')}>
                    {it.L('What is this?')}
                </span>
            </label>
        </div>
    </Fieldset>
);

export default PepDeclaration;
