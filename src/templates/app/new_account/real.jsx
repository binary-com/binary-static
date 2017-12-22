import React from 'react';
import PepDeclaration from '../_includes/pep_declaration.jsx';
import ProfessionalClient from '../_includes/professional_client.jsx';
import { Fieldset } from '../../_common/components/forms.jsx';
import {
    Salutation,
    FirstName,
    LastName,
    DateOfBirth,
    Residence,
    AccountOpeningReason,
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressPostcode,
    AddressState,
    Phone,
    SecretQuestion,
    SecretAnswer,
    ClientMessage,
    Tnc,
} from '../../_common/components/forms_common_rows.jsx';

const Real = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Real Money Account Opening')}</h1>
        <form id='frm_real' className='gr-padding-10'>
            <Fieldset legend={it.L('Details')}>
                <Salutation />
                <FirstName />
                <LastName />
                <DateOfBirth />
                <Residence />
                <AccountOpeningReason />
            </Fieldset>

            <Fieldset legend={it.L('Address')}>
                <AddressLine1 />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode />
                <Phone />
            </Fieldset>

            <Fieldset legend={it.L('Security')}>
                <SecretQuestion />
                <SecretAnswer />
            </Fieldset>

            <PepDeclaration />

            <ProfessionalClient />

            <Tnc />
        </form>

        <ClientMessage />
    </div>
);

export default Real;
