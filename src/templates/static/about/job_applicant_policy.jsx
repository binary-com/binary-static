import React from 'react';

const JobApplicantPrivacyPolicy = () =>  (
    <div className='container'>
        <h2 data-anchor='job-application-policy'>{it.L('Job application privacy policy')}</h2>
        <p>{it.L('Deriv Group of companies (hereafter referred to as \'the Company\' and \'It\') is committed to protecting the privacy and security of the applicant\'s personal information. This privacy notice sets out the types of data that the Company collects on the applicant. It also sets out how the Company collects and uses the applicant\'s personal data, how long it keeps them, and other relevant information about the applicant\'s data in accordance with the General Data Protection Regulation (EU) 2016/679 (hereafter referred to as \'GDPR\') and Data Protection Act 2018.')}</p>
        <p>{it.L('This privacy notice only applies to job applicants residing in the EU.')}</p>
        <p>{it.L('The Company is required under data protection legislation to notify the applicant of the information contained in this privacy notice. As such, it is important that the applicant read this notice, together with any other privacy notice that the Company may provide for the applicant on specific occasions when the Company is collecting or processing personal data about the applicant, so that the applicant is aware of how and why the Company is using such information.')}</p>

        <h2 data-anchor='interpretations'>{it.L('Interpretations')}</h2>
        <p>{it.L('The following terms shall have the meanings set out below and cognate terms shall be construed accordingly:')}</p>
        <p><strong>&#39;{it.L('Data Protection Act (DPA)')}&#39;</strong> {it.L('shall mean Data Protection Act 2018, Chapter 440 of the Laws of Malta.')}</p>
        <p><strong>&#39;{it.L('GDPR')}&#39;</strong> {it.L('shall mean EU General Data Protection Regulation 2016/679.')}</p>
        <p><strong>&#39;{it.L('Processing')}&#39;</strong> {it.L('shall mean any operation which is performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, restriction, erasure, or destruction, etc.')}</p>

        <h2 data-anchor='types-of-personal-data-collected'>{it.L('Types of personal data collected')}</h2>
        <p>{it.L('The Company collects, stores, and processes a range of information about the applicant, including but not limited to the following:')}</p>
        <ul className='bullet'>
            <li>{it.L('The applicant\'s personal details, including name, address, date of birth, nationality, gender, and contact details, comprising email address and telephone number')}</li>
            <li>{it.L('The applicant\'s qualifications, skills, education, experience, and employment history')}</li>
            <li>{it.L('Details of the applicant\'s current level of remuneration, including entitlement to benefits such as pensions or insurance cover, if applicable')}</li>
            <li>{it.L('Information about the applicant\'s medical or health conditions, including whether or not the applicant has a disability for which the Company needs to make reasonable adjustments')}</li>
        </ul>
        <p>{it.L('The Company may collect this information in a variety of ways. Data is collected and contained in CVs or resumes, cover letters, and identity documents, via Self-Assessment Topgrading Questionnaires/Interview (SATI), or through interviews or other forms of assessment, including online tests.')}</p>
        <p>{it.L('The Company may also collect personal data about the applicant from third parties, such as further references supplied by former employers and information from criminal records checks permitted by law.')}</p>
        <p>{it.L('Data will be stored in a range of different places, including on the applicant\'s application record, in HR management systems, and on other IT systems (including email).')}</p>

        <h2 data-anchor='purpose-of-collecting-personal-data'>{it.L('Purpose of collecting personal data')}</h2>
        <p>{it.L('The Company typically collects and processes the applicant\'s personal data for the purposes of the legitimate interests that It pursues. Here are some examples of such interests:')}</p>
        <ul className='bullet'>
            <li>{it.L('Making decisions about who to employ and what salary and benefits to offer')}</li>
            <li>{it.L('Making any reasonable adjustments for disabled employees')}</li>
            <li>{it.L('Responding to and defending against legal claims')}</li>
        </ul>
        <p>{it.L('The Company also collects and processes the applicant’s data to decide whether to enter into a contract with the applicant.')}</p>
        <p>{it.L('In some cases, the Company needs to process the applicant\’s personal data to comply with the Company\’s legal obligations, for example conducting necessary checks in relation to the right to work in a specific jurisdiction.')}</p>
        <p>{it.L('The applicant is under no statutory or contractual obligation to provide data to the Company during the recruitment process. However, if the applicant chooses not to provide any necessary information, the Company may not be able to proceed with their application.')}</p>

        <h2 data-anchor='confidentiality'>{it.L('Confidentiality')}</h2>
        <p>{it.L('The Company shall ensure the confidentiality of all personal data provided by the applicant at all times and is protected against any accidental loss or disclosure, destruction, and abuse. The Company shall also ensure that such personal data is only processed and stored as necessary for the purposes specified in this privacy policy and all applicable Data Protection Laws.')}</p>
        <p>{it.L('The Company shall further disclose information about the applicant internally within the Deriv Group of companies for the purpose of the recruitment exercise. The Company shall ensure that a data-sharing agreement is in place and that the applicant\'s data is held securely and in line with GDPR requirements. The Company shall further disclose information about the applicant when It is legally obligated to do so.')}</p>

        <h2 data-anchor='data-retention'>{it.L('Data retention')}</h2>
        <p>{it.L('The applicant\'s personal data shall be stored for a period of six months after the end of the relevant recruitment process if the applicant is unsuccessful in their job application or if they have declined an offer of employment with the Deriv Group of companies. At the expiry of that period, the applicant\'s data is deleted or destroyed unless the Company is required to further retain the applicant\'s information to exercise or defend any legal claims.')}</p>
        <p>{it.L('If the applicant\'s application is successful and an offer of employment with the Company is accepted, the applicant\'s data will be retained until the cessation of their employment. In this case, a separate privacy policy for employees will be made available to the applicant.')}</p>

        <h2 data-anchor='applicants-rights'>{it.L('Applicant\'s rights')}</h2>
        <p>{it.L('In light of the EU General Data Protection Regulation 2016/679 and the Data Protection Act 2018, the applicant is entitled to the following rights with regards to the applicant\'s personal data:')}</p>
        <ul className='bullet'>
            <li>{it.L('The right to be informed of the use of their personal data, as reflected in this privacy policy')}</li>
            <li>{it.L('The right to request access to their data from the Company')}</li>
            <li>{it.L('The right to rectify their personal data if the Company holds any information about the applicant that is incomplete or inaccurate')}</li>
            <li>{it.L('The right to delete their personal information, subject to the data retention practice of the Company')}</li>
        </ul>

        <p>{it.L('The applicant also has the right to restrict the further processing of their personal data.')}</p>
        <p>{it.L('In some circumstances, the applicant has the right to data portability, which is the right to request a copy of their personal data in a digital format and, where possible, ask the Company to transfer it to another company.')}</p>
        <p>{it.L('The applicant has the right to lodge a complaint to the Data Protection Commissioner in Malta if the applicant believes that the Company has failed to comply with the requirements of EU General Data Protection Regulation 2016/679 or the Data Protection Act 2018 with regards to the applicant\'s personal data.')}</p>

        <h2 data-anchor='automated-decision-making'>{it.L('Automated decision-making')}</h2>
        <p>{it.L('The applicant will not be subject to any recruitment decisions based solely on automated decision-making that will have a significant impact on the applicant.')}</p>

        <h2 data-anchor='changes-to-this-policy'>{it.L('Changes to this privacy policy')}</h2>
        <p>{it.L('The Company reserves the right to update this privacy policy at any time and will provide the applicant with a new privacy policy when substantial amendments and updates are made. The Company may also notify the applicant in other ways from time to time about the processing of the applicant\'s personal information.')}</p>
        <p>{it.L('If the applicant has any questions about this privacy policy or if the applicant would like to exercise any of their rights, they should contact the Company\'s Data Protection Officer (DPO) by emailing [_1].', '<a href="mailto:dpo@binary.com">dpo@binary.com</a>')}</p>
    </div>
);

export default JobApplicantPrivacyPolicy;
