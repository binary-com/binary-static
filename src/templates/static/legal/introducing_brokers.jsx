import React from 'react';
import { Li } from './metatrader/terms_and_conditions.jsx';

const IntroducingBrokers = () => (
    <div>
        <h2 data-anchor='introducing-brokers'>{it.L('Introducing Brokers')}</h2>
        <p>{it.L('This Agreement sets out the terms and conditions between [_1] and the Introducing Broker in providing Introducing Broker services to the Company in accordance with the provisions and terms of this Agreement.', it.website_name)}</p>
        <p>{it.L('The services offered by the Introducing Broker to the clients are offered because the Introducing Broker is approved and qualified to offer such services. Additionally, such services are offered by the Introducing Broker fairly, honestly, and in good faith and in accordance with all business-ethics rules.')}</p>
        <p>{it.L('It is hereby agreed as follows: ')}</p>
        <ol>
            <Li
                title={it.L('Definitions')}
                paragraph={it.L('In this Agreement, unless the context otherwise requires, the following definitions hold:')}
            >
                <p><strong>{it.L('Account')}</strong>{it.L(' means a client\'s trading account opened with Binary in accordance with the account procedure provided on [_1].', it.website_name)}</p>
                <p><strong>{it.L('Agreement')}</strong>{it.L(' means this agreement and includes all appendices, schedules and annexures as amended, supplemented, replaced, or novated.')}</p>
                <p><strong>{it.L('Affiliate Arrangement')}</strong>{it.L(' means an arrangement where Binary devotes its time and resources to identify prospective clients in a specified manner.')}</p>
                <p><strong>{it.L('Associate')}</strong>{it.L(' means any physical person or any type of legal person or entity or body of persons which has business, commercial, financial, entrepreneurial, employment, agency, family, personal, and other links or bonds with the Introducing Broker and includes any person who has the same personal information, IP address, physical or mailing address, telephone number, email address, or passport details as the Introducing Broker.')}</p>
                <p><strong>{it.L('Authorisation')}</strong>{it.L(' means any written notarisation, certificate, license, approval, permission, Authority, exemptions, registration, filing, agreement, consent, notice, or notice of non-objection.')}</p>
                <p><strong>{it.L('Authority')}</strong>{it.L(' means organisation, whether governmental or not, or physical person or any type of legal person or entity or body of persons and any executor, administrator, or representative of such Competent Authority located in any jurisdiction that has legally delegated or invested authority, capacity, power, or competence to perform a designated function.')}</p>
                <p><strong>{it.L('Business Day')}</strong>{it.L(' means Monday to Friday (UTC+8).')}</p>
                <p><strong>{it.L('Client Information')}</strong>{it.L(' means all of the information about the client, including but not limited to their name, address, contact details, account details and trading history.')}</p>
                <p><strong>{it.L('Commission')}</strong>{it.L(' means the commission payable by Binary to the Introducing Broker as set out in the Appendix below.')}</p>
                <p><strong>{it.L('Competent Authority')}</strong>{it.L(' means any organisation, whether governmental or not, or physical person or any type of legal person or entity or body of persons and any executor, administrator, or representative of such Competent Authority located in any jurisdiction that has legally delegated or invested authority, capacity, power, or competence to perform a designated function.')}</p>
                <p><strong>{it.L('Company or Binary')}</strong>{it.L(' means [_1].', it.website_name)}</p>
                <p><strong>{it.L('Effective Date')}</strong>{it.L(' means the commencement date of this Agreement.')}</p>
                <p><strong>{it.L('Introducing Broker')}</strong>{it.L(' means any potential individual or entity willing to provide Binary with IB services.')}</p>
                <p><strong>{it.L('Law')}</strong>{it.L(' means all laws including rules of common law, principles of equity, statutes, regulations, proclamations, ordinances, by-laws, rules, regulatory principles and requirements, policy statements, practice notes, mandatory codes of conduct, writs, orders, injunctions, judgments, determinations, and statutory licence conditions.')}</p>
                <p><strong>{it.L('Malicious Activity')}</strong>{it.L(' means any manipulations of Binary\'s systems and business in ways which resulted in any adverse, special, incidental, punitive or consequential loss or damages to Binary.')}</p>
                <p><strong>{it.L('Marketing Materials')}</strong>{it.L(' means any content, whether in electronic or hard copy form, created by or under Binary\'s direction, for the purpose of marketing the Binary business or services, and incorporating the Binary Trademarks.')}</p>
                <p><strong>{it.L('Trademark')}</strong>{it.L(' means any trademarks, signs, logos, designs, expressions, and trading names owned by or licensed to Binary, whether registered or not registered, and any subsequent trademark created.')}</p>
            </Li>
            <Li
                title={it.L('Acceptance of Agreement')}
                paragraph={it.L('By indicating the acceptance of the terms and conditions of this Agreement and continuing with the Introducing Broker application to join the Company\'s Introducing Broker programme, the Introducing Broker is hereby agreeing with all the terms and provisions stated herein.')}
            />
            <p>{it.L('The Company shall, in its absolute discretion, determine whether the application of the Introducing Broker has been successful. The Company\'s decision is final and is not subject to any appeal.')}</p>
            <p>{it.L('The Company shall notify the Introducing Broker upon the successful approval of the Introducing Broker application.')}</p>
            <Li
                title={it.L('General')}
            >
                <p>{it.L('This Agreement constitutes the entire agreement between the parties, and no earlier representation or arrangement, written or oral, relating to any matter dealt with in this Agreement between the parties shall have any force or effect before the Effective Date.')}</p>
                <p>{it.L('Each party shall do anything reasonably required by the other party to give effect to the provisions and terms of this Agreement.')}</p>
                <p>{it.L('Should any provisions or terms of this Agreement become invalid or unenforceable, the provision or term shall be severed from the remainder of the Agreement and shall not render the remainder Agreement to be invalid or unenforceable.')}</p>
                <p>{it.L('If the Introducing Broker breaches any of the provisions or terms of this Agreement, the Company shall have the discretion to suspend any or all payments to the Introducing Broker.')}</p>
                <p>{it.L('The Company may modify any provisions or terms of this Agreement at any time. It is the responsibility of the Introducing Broker to consistently review all modifications in the Agreement made on the website.')}</p>
                <p>{it.L('The section headings are for convenience only and shall not control or affect the meaning, construction, scope, and intent of any of the provisions of this Agreement.')}</p>
            </Li>
            <Li
                title={it.L('Introduction of clients and instructions')}
            >
                <p>{it.L('The Introducing Broker shall use their experience, knowledge, and best efforts to provide IB services to Binary, and Binary shall remunerate the Introducing Broker for IB services in accordance to the Commission structure listed on [_1] Introducing Broker programme.', it.website_name)}</p>
                <p>{it.L('Upon request from the Company or its legal representatives or government regulators, the Introducing Broker must promptly grant Binary with unlimited access to information to the extent that Binary requires to satisfy any legal or regulatory requirement or obligation.')}</p>
                <p>{it.L('The parties agree that the relationship between Binary and the Introducing Broker is not an exclusive relationship and both the Introducing Broker and Binary may enter into similar relationships with other parties.')}</p>
            </Li>
            <Li
                title={it.L('The Introducing Broker\'s obligations')}
            >
                <p>{it.L('The Introducing Broker must notify the Company immediately if they cease to possess any relevant Authorisation required or cease to be competent, capable, adequate, or qualified to effectively perform all their duties and obligations undertaken and agreed to under this Agreement for any reason, including but not limited to lack of knowledge, expertise, experience, skills, and time. The Introducing Broker must also promptly notify the Company in writing upon the initiation of any proceedings in bankruptcy, dissolution, or liquidation.')}</p>
                <p>{it.L('In providing IB services, the Introducing Broker shall')}
                    <ol>
                        <li>{it.L('Use their best endeavours to attract potential clients for Binary')}</li>
                        <li>{it.L('Use the Marketing Materials provided by Binary solely for the purpose of providing IB services and in accordance with Binary\'s instructions')}</li>
                        <li>{it.L('Provide Binary with any information that they have become aware of which may result in an adverse or harmful consequence for Binary and its reputations')}</li>
                        <li>{it.L('Implement and comply with all business-related directions, policies, and procedures of Binary as enacted, amended, or replaced from time to time')}</li>
                        <li>{it.L('Comply with any Competent Authorities\' requests or directions')}</li>
                        <li>{it.L('Perform IB services and other obligations mentioned here at their own cost and risk')}</li>
                        <li>{it.L('Fairly and accurately describe Binary\'s business and services in a transparent manner to the clients')}</li>
                        <li>{it.L('Provide information to clients only on technical and educational matters')}</li>
                        <li>{it.L('Inform any clients introduced to Binary that the trading services and products are offered by or through Binary and not the Introducing Broker')}</li>
                        <li>{it.L('Inform any clients introduced to Binary of any matter that the Company may reasonably consider necessary in order to comply with any legal/regulatory requirements ')}</li>
                    </ol>
                </p>
                <p>{it.L('Where the Introducing Broker owns, or operates, a website and wishes to include Binary\'s services, the Introducing Broker shall')}
                    <ol>
                        <li>{it.L('Receive the approval of the Company to include any information in relation to Binary')}</li>
                        <li>{it.L('Provide a web-link from their own website to [_1]', it.website_name)}</li>
                        <li>{it.L('Include a disclaimer or notice that the intellectual property rights of the Trademark solely belong to Binary and any use of it is strictly prohibited unless Binary has given such authorisation.')}</li>
                    </ol>
                </p>
                <p>{it.L('The Introducing Broker consents to the disclosure of their identity on the webpage of [_1] or any publicly accessible medium managed by Binary.', it.website_name)}</p>
                <p>{it.L('The Introducing Broker pledges that they shall not at any time')}
                    <ol>
                        <li>{it.L('Indicate that Binary or the Introducing Broker and their Associates will guarantee a client\'s profit or loss or limit the losses of any client')}</li>
                        <li>{it.L('Misrepresent Binary or the services that are offered by Binary')}</li>
                        <li>{it.L('Engage in misleading or deceptive conduct or illusory or deceptive advertising')}</li>
                        <li>{it.L('Prepare and publish any content or place any advertisements that refer to Binary and its relationship with Binary without the prior written consent of Binary')}</li>
                        <li>{it.L('Amend or change all or any part of the Marketing Material without Binary\'s prior written consent')}</li>
                        <li>{it.L('Use the name \'Binary\' or any derivation of that name such as \'[_1]\' or the Binary Trademarks in a way that might compete with Binary\'s search engine optimisation without the prior written consent of Binary, which includes using the name \'[_1]\' on the title tag of the Introducing Broker\'s website', it.website_name)}</li>
                        <li>{it.L('Refer clients to Binary with the knowledge, or with a reasonably expected knowledge, that these clients engage in such conduct that constitutes Malicious Activity')}</li>
                        <li>{it.L('Provide any financial/investment trading advice to clients (Binary shall not be liable to the Introducing Broker and the client for any misrepresentation or fraudulent or negligent misstatement made by the Introducing Broker. The Introducing Broker shall also hold Binary harmless and shall indemnify Binary and its directors, officers, managers, employees, or agents from and against any liabilities, losses, damages, costs, and expenses, including all and any legal fees incurred arising out of the failure of the Introducing Brokers to comply with any or all of their obligations set forth in this Agreement.)')}</li>
                    </ol>
                </p>
            </Li>
            <Li
                title={it.L('Accounts')}
                paragraph={it.L('Binary shall have the absolute discretionary power to accept or reject an application to open an Account by a client introduced by the Introducing Broker.')}
            />
            <Li
                title={it.L('Commissions')}
                paragraph={it.L('Commission shall only be paid where the following are met cumulatively:')}
            >
                <ol>
                    <li>{it.L('Closed/complete trades')}</li>
                    <li>{it.L('Closed trades made by clients introduced by an Introducing Broker and duly approved by Binary')}</li>
                </ol>
                <p>{it.L('However, Introducing Brokers contracted with Deriv Investments (Europe) Ltd shall be paid on a Cost Per Acquisition (CPA) deal only, whereby the Introducing Broker shall become eligible for payment of a set amount only upon the introduction of a client to Binary and as long as the Introducing Broker is providing an enhanced service to the clients.')}</p>
                <p>{it.L('Commission will not be paid for Accounts that have been opened or traded by an Associate of the Introducing Broker.')}</p>
                <p>{it.L('Binary will pay the Commission to the Introducing Broker before or on the 15th day of the month following the calendar month in which the trades were made (Due Date).')}</p>
                <p>{it.L('The Introducing Broker acknowledges that the Commission received by the Introducing Broker pursuant to this Agreement fully compensates for its obligations under this Agreement.')}</p>
                <p>{it.L('The Introducing Broker is responsible for the payment of their own taxes, duties, fees, or other governmental levies or charges. Any fees payable by Binary to the Introducing Broker in connection with this Agreement are exclusive of any such taxes, duties, fees, or levies.')}</p>
                <p>{it.L('The clauses above shall not apply in its entirety to any Introducing Brokers who are contracted to provide Introducing Broker services with Deriv Investments (Europe) Ltd.')}</p>
            </Li>
            <Li
                title={it.L('Introducing Broker warranties')}
                paragraph={it.L('The Introducing Broker warrants to the Company at all times that')}
            >
                <ol>
                    <li>{it.L('All information/documentations provided by the Introducing Broker when applying for Binary\'s Introducing Broker programme is true and accurate.')}</li>
                    <li>{it.L('They have obtained all Authorisations and are not aware of anything that shall or might reasonably be expected to prevent them from entering and performing all of their obligations under this Agreement.')}</li>
                    <li>{it.L('They are not aware of anything that shall, or might reasonably be expected to, prevent, or obstruct them from performing all of their obligations under this Agreement, in the manner and at the times contemplated by this Agreement.')}</li>
                    <li>{it.L('They will comply with all laws when performing their obligations under this Agreement.')}</li>
                    <li>{it.L('This Agreement has been duly executed and constitutes binding obligations on both parties, enforceable against it in accordance with its Terms.')}</li>
                </ol>
            </Li>
            <Li
                title={it.L('Limitation of liability')}
            >
                <p>{it.L('Other than the payment of Commissions, Binary is not liable to the Introducing Broker or their Associates or any other person for any matter arising out of or in relation to this Agreement whether under the law of tort, contract, or equity or otherwise for any loss.')}</p>
                <p>{it.L('The Introducing Broker agrees to indemnify Binary against any loss that Binary may suffer or incur arising out of, or in connection with, any act or omission of the Introducing Broker, or as a result of any fraud, negligence, wilful default, or material breach of this Agreement.')}</p>
            </Li>
            <Li
                title={it.L('Term and termination of this Agreement')}
            >
                <p>{it.L('This Agreement shall commence on the Effective Date and will continue to be in full force and effect until this Agreement is terminated in accordance with the provisions and terms of this Agreement.')}</p>
                <p>{it.L('Either party may terminate this Agreement at any time by giving a seven-day (7) advanced written notice to the other party.')}</p>
                <p>{it.L('If any of the parties is a physical person, this Agreement shall be terminated in the event of death or physical or mental incapacity of such parties. ')}</p>
                <p>{it.L('This Agreement shall be terminated should the behaviour of the Introducing Broker constitute negligence, misconduct, or wilful default.')}</p>
                <p>{it.L('This Agreement shall be equally terminated in the event of bankruptcy, insolvency, or liquidation of either party. ')}</p>
                <p>{it.L('On termination of this Agreement')}
                    <ol>
                        <li>{it.L('Binary shall pay Commissions for any trades placed by clients prior to the date of termination but shall not be liable to pay Commissions for any trades placed by clients on or after the date of termination. In the case of the Introducing Brokers who are contracted with Deriv Investments (Europe) Ltd, any pending Commission from the CPA deal prior to the date of termination shall be paid in full.')}</li>
                        <li>{it.L('The Introducing Broker shall immediately cease using the Marketing Materials whether in hard copy or electronically on any website and return all Marketing Materials to Binary. They shall also cease referring to Binary and shall remove all of the Binary Trademarks, including logos, branding, and other references to Binary from their website and/or marketing materials.')}</li>
                        <li>{it.L('The Introducing Broker acknowledges that on termination, they have no claims against Binary whatsoever and are not entitled to any compensation or claim arising from the termination.')}</li>
                        <li>{it.L('If the Introducing Broker engages in Malicious Activity, Binary, in its absolute discretion, may')}
                            <ol>
                                <li>{it.L('Refuse to pay any Commission to the Introducing Broker engaged in the Malicious Activity')}</li>
                                <li>{it.L('Set off any Commission paid or payable by Binary to the Introducing Broker against any amounts held in any accounts of the Company')}</li>
                            </ol>
                        </li>
                    </ol>
                </p>
            </Li>
            <Li
                title={it.L('Notices')}
            >
                <p>{it.L('Any notice required by this Agreement shall be in writing and shall be emailed to the following addresses:')}
                    <ol>
                        <li><a href='mailto:compliance@binary.com'>compliance@binary.com</a></li>
                        <li><a href='mailto:affiliates@binary.com'>affiliates@binary.com</a></li>
                    </ol>
                </p>
                <p>{it.L('In any event, an email notice shall be presumably and sufficiently served upon the completion of sending the email. Should the email be sent on a non-Business Day, it shall be presumably and sufficiently served on the next Business Day.')}</p>
            </Li>
            <Li
                title={it.L('Confidential information')}
            >
                <p>{it.L('Neither party shall, without the prior written consent of the other, disclose any details or information acquired directly or indirectly as a result of the relationship contemplated by this Agreement to any person or use the same for their own benefit, other than as contemplated in this Agreement.')}</p>
                <p>{it.L('The clause above shall not apply to any information to the extent')}
                    <ol>
                        <li>{it.L('To which it, at the time of execution of this Agreement was, or subsequently has become, in the public domain through no fault of the parties')}</li>
                        <li>{it.L('That the recipient is obliged by Law to disclose such information, provided that the recipient promptly advises the other party of the legal obligation to disclose such information')}</li>
                        <li>{it.L('That the parties agree in writing that both parties will be exempt from the provisions of this clause')}</li>
                    </ol>
                </p>
                <p>{it.L('Each party will')}
                    <ol>
                        <li>{it.L('Take all necessary steps at all times to ensure the non-disclosure and confidentiality of other party\'s confidential information')}</li>
                        <li>{it.L('Require its Associates, employees, and agents not to disclose or copy any of the other party\'s confidential information for any purpose except as permitted under this Agreement')}</li>
                    </ol>
                </p>
                <p>{it.L('The obligations under this clause shall survive after the termination of this Agreement.')}</p>
            </Li>
            <Li
                title={it.L('Assignment')}
            >
                <p>{it.L('Binary may assign any or all of its rights under this Agreement to a third party.')}</p>
                <p>{it.L('The Introducing Broker may not assign any or all of its rights under this Agreement without the prior written consent of Binary.')}</p>
            </Li>
            <Li
                title={it.L('Agency or partnership')}
                paragraph={it.L('The parties agree that nothing in this Agreement creates a relationship between them of employer/employee or principal/agent, a joint venture, or a partnership. Each party shall perform this Agreement as an independent contractor and shall solely be responsible for its own action or inaction.')}
            />

            <Li
                title={it.L('Force majeure event')}
            >
                <p>{it.L('No party shall be deemed liable for a partial or complete failure to meet its obligations under this Agreement, in case of force majeure events, including but not limited to civil war, unrest, insurrection, international intervention, any governmental actions, exchange controls, nationalisations, devaluations, forfeitures, natural disasters, act of God, and other inevitable or unforeseeable, unanticipated, and unpredicted events not depending on the will of the parties.')}</p>
                <p>{it.L('The party that, due to force majeure events, is not able to meet their obligations under this Agreement, shall inform the other party in writing within six (6) days after the occurrence of such an event.')}</p>
                <p>{it.L('Should force majeure events last for more than thirty (30) Business Days, the party not suffering force majeure events may terminate this Agreement immediately.')}</p>
            </Li>
            <Li
                title={it.L('Governing law')}
                paragraph={it.L('This Agreement will be governed and construed in accordance with the laws of the country in which the relevant subsidiary is located, and the parties shall submit to the non-exclusive jurisdiction of the same courts.')}
            />
        </ol>
    </div>
);

export default IntroducingBrokers;
