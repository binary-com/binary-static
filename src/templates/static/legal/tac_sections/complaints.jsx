import React from 'react';

const Complaints = () => (
    <div>
        <h2>{it.L('Complaints and Disputes')}</h2>
        <p>{it.L('If you would like to file a complaint with regards to our service, kindly contact us providing any relevant details relating to your complaint. We shall investigate your enquiry and a response will be given to your enquiry. We will usually provide a final response within 1-2 weeks (and at most within 2 months) from receipt of all relevant details.')}</p>
        <p>{it.L('If your complaint relates to an outcome of a trade or a transaction and remains unresolved, it will turn into a dispute. Should you be unsatisfied with our response, you can choose to escalate your complaint to the regulator or to an alternative dispute resolution entity.')}</p>
        <p>{it.L('Clients registered with Binary (C.R.) S.A. can raise their unresolved disputes with management by submitting an email to complaints@binary.com.')}</p>
        <p>{it.L('Clients registered with Binary (IOM) Ltd can raise their unresolved disputes with the alternative dispute resolution entity IBAS by filling the adjudication form on the ADR entity\'s [_1]website[_2].',
            '<a href=\'https://www.ibas-uk.com\' target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>')}
        </p>
        <p>{it.L('Clients registered with Binary (Europe) Ltd can raise their unresolved disputes with the Malta Gaming Authority [_1] at [_2]. UK clients registered with Binary (Europe) Ltd can submit their dispute with the alternative dispute resolution entity IBAS by filling the adjudication form on the ADR entity\'s [_3]website[_4].',
            '<a href="http://www.mga.org.mt/" target="_blank" rel="noopener noreferrer">(www.mga.org.mt)</a>', 'support.mga@mga.org.mt', '<a href=\'https://www.ibas-uk.com\' target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>')}
        </p>
        <p>{it.L('Alternatively, clients who are registered with both Binary (IOM) Ltd and Binary (Europe) Ltd, instead of submitting their dispute to IBAS, they can make use of the European Commission\'s Online Dispute Resolution (ODR) platform available [_1]here[_2].',
            '<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p>{it.L('Clients registered with Binary Investments (Europe) Ltd can raise their unresolved disputes with the Office of the Arbiter for Financial Services. Contact details and guidance on making a complaint with the Arbiter’s Office can be found [_1]here[_2].',
            '<a href="https://financialarbiter.org.mt" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p>{it.L('It is important that you refer your disputes to the appropriate ADR for the claims to be valid.')}</p>
    </div>
);

export default Complaints;
