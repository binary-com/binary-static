import React from 'react';

const Complaints = () => (
    <div>
        <h2 data-anchor='complaints-and-disputes'>{it.L('Complaints and disputes')}</h2>
        
        <p>{it.L('If the client would like to file a complaint with regards to the Company\'s service, the client can contact the Company at [_1], providing any relevant details relating to the client\'s complaint. [_2]If you are registered with Deriv (Europe) Limited, you can also place a complaint by calling [_3].[_4] The Company will investigate each inquiry and provide a final response in the shortest time possible.',
            '<a href=\'mailto:complaints@binary.com\'>complaints@binary.com</a>', '<span data-show="malta">', '<a href=\'call:+447723580049\'>+447723580049</a>', '</span>')}
        </p>

        <p data-show='eucountry'>{it.L('If the client\'s complaint relates to the Company\'s data processing practices, the client may formally submit a complaint to the Information and Data Protection Commissioner (Malta) on the entity\'s [_1]website[_2]. Alternatively, the client can make a complaint to any Supervisory Authority within the European Union.',
            '<a href="https://idpc.org.mt/en/Pages/Home.aspx" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('Clients registered with Deriv (MX) Ltd can formally submit a complaint to their local Supervisory Authority.')}</p>
        <p data-show='eucountry'>{it.L('If the client\'s complaint relates to an outcome of a trade or a transaction and remains unresolved, it will turn into a dispute. Should clients be unsatisfied with the Company\'s response, they can choose to escalate their complaint to the regulator or to an alternative dispute resolution entity.')}</p>
        <p data-show='eucountry'>{it.L('Clients registered with Deriv (MX) Ltd or Deriv (Europe) Limited can raise their unresolved disputes with the alternative dispute resolution entity IBAS by filling the adjudication form on the ADR entity\'s [_1]website[_2]. Alternatively, they can make use of the European Commission\'s Online Dispute Resolution (ODR) platform available [_3]here[_4]. Clients registered with Deriv (Europe) Limited can also refer their unresolved disputes to the Malta Gaming Authority via the [_5]Player Support Unit[_6].',
            '<a href=\'https://www.ibas-uk.com\' target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>', '<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">', '</a>', '<a href="https://www.mga.org.mt/support/online-gaming-support/" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('Clients registered with Deriv Investments (Europe) Limited can raise their unresolved disputes with the Office of the Arbiter for Financial Services. Contact details and guidance on making a complaint with the Arbiter\'s Office can be found [_1]here[_2].',
            '<a href="https://financialarbiter.org.mt" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p id='mf_uk' className='invisible'>{it.L('If you reside in the UK and you are unhappy with our response you may escalate your complaint to the [_1]Financial Ombudsman Service[_2].',
            '<a href="https://www.financial-ombudsman.org.uk" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('It is important that clients refer their disputes to the appropriate ADR for the claims to be valid.')}</p>
    </div>
);

export default Complaints;
