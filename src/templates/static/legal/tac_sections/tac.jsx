import React from 'react';

const Tac = () => (
    <div>
        <h2 data-anchor='terms-and-conditions'>{it.L('Terms and conditions')}</h2>
        <p><i>{it.L('Version 49. Last modified 23-11-2020.')}</i></p>
        <p>{it.L('It is the responsibility of each client to read and understand this legal notice and the terms and conditions ("Terms") pursuant to which an acquisition of financial contracts via this site is governed.')}</p>

        <h2 data-anchor='interpretation'>A. {it.L('Interpretation')}</h2>
        <p>
            {it.L('Depending on the jurisdiction to which a client\'s account has been attached in accordance with the account opening procedures of the website and as detailed in the About us section of the website and the type of products offered, the term "the Company" shall denote,')}&nbsp;
            <span data-show='-eucountry'>{it.L('Deriv (SVG) LLC,')}&nbsp;</span>
            <span>{it.L('Deriv (Europe) Limited,')}&nbsp;</span>
            <span>{it.L('Deriv Investments (Europe) Limited, or')}&nbsp;</span>
            <span>{it.L('Deriv (MX) Ltd.')}&nbsp;</span>
        </p>
        <p>{it.L('These terms and conditions may be supplemented from time to time by supplementary terms and conditions applicable to a particular Company or products.')}</p>

        <h2 data-anchor='introduction'>B. {it.L('Introduction')}</h2>
        <p>{it.L('The financial trading services contained within this site are only suitable for clients who are able to bear the loss of all the money they invest and who understand and have experience of the risks involved in the acquisition of financial contracts.')}</p>
        <p>{it.L('International currency or commodity prices are highly volatile and very difficult to predict. Due to such volatility, plus the bias in the pricing system favouring the website (as described in more detail below), no financial contract purchased in our system (whether or not the payout exceeds the premium amount) can be considered a safe contract.')}</p>
        <p>{it.L('The maximum loss that may be incurred by any client is the amount of money paid by the client to the Company.')}</p>
        <p>{it.L('The Company reserves the right in its sole discretion to refuse and/or cancel services and charge deposit and/or withdrawal fees to anyone for any reasons including, but not limited to the following:')}</p>
        <ul className='bullet'>
            <li>{it.L('Any instance where the Company believes that that person\'s activities at this site may be illegal in that person\'s country or state')}</li>
            <li>{it.L('Any instance where the Company may be approached or contacted by legal authorities or regulators from that person\'s country or state')}</li>
            <li>{it.L('Any instance where the Company may suffer any pecuniary, fiscal, or regulatory disadvantage by virtue of that person\'s activities at this site')}</li>
            <li>{it.L('Any restriction to its clients from purchasing any contracts during certain hours')}</li>
        </ul>

        <h2 data-anchor='languages'>C. {it.L('Languages')}</h2>
        <p>{it.L('These terms and conditions are provided in several different languages for clients\' convenience; however, these translations do reflect the same principles. The Company attempts, as much as possible, to provide a faithful translation in English of the official language of several countries. In the event of any differences between the English version of the website and any other language, the English version shall prevail.')}</p>
        <p><span>{it.L('The client may communicate with the Company through this website or by means of e-mail, phone or, exceptionally, by post. Details can be found in the Contact us page.')}</span><span data-show='eucountry'>{it.L(' All calls are recorded for training and monitoring purposes.')}</span></p>
        <p>{it.L('Generally the Company will communicate with the client through this website or by email to the email address given by the client upon account opening. The Company will communicate with the client in English or, if another preferred language is selected at account opening, in that language.')}</p>
        <p>{it.L('In cases where the client uses excessive anti-spam filtering which requires the Company to pay a fee in order to send a reply or a notification to the client, the Company will try to find an alternative way to communicate with the client but will not pay the requested fees to do so.')}</p>

        <h2 data-anchor='governing-laws-and-jurisdiction'>D. {it.L('Governing laws and jurisdiction')}</h2>
        <p>{it.L('It is the responsibility of clients accessing this site to make sure that they understand and fully follow the relevant laws and regulations of their own country. The Company does not support any offerings or make any solicitations that are illegal in a client\'s country, and clients cannot use their account for such prohibited offerings. In some countries, the Company may not be permitted to offer products and services to clients unless they have taken proactive steps to solicit information about the Company\'s products and services and requested to be provided with them. Access to this site and the offering of certain trades via this site may be also restricted in some jurisdictions. It is the client\'s responsibility to know about the restrictions that apply in the client\'s country of residence and to observe them, as in continuing to access the Company\'s products and services, the client represents to the Company that the client is doing so legally and that, where relevant, the client has solicited information about the Company\'s products and services and requested to be provided with them.')}</p>
        <p>{it.L('Depending on where the client lives, the client\'s account will be governed by the laws of the country of incorporation of the company that the client\'s account is registered with as set out below. If the client has registered more than one account with more than one company, each account will be governed by the law of the country of incorporation of the company that each individual account has been registered with. The client agrees to submit to the applicable jurisdiction\'s courts and bring any claim the client may have before them. These courts will have sole authority to settle any disputes that may arise between the client and the Company.')}</p>
        <p>{it.L('If a court or regulatory body of competent jurisdiction declares any provision of the Terms to be invalid or unenforceable, the rest of the Terms shall remain in full force and effect.')}</p>
        <p>{it.L('The applicable jurisdiction shall be one of the following:')}</p>
        <ul className='bullet'>
            <li>{it.L('Deriv Investments (Europe) Limited and Deriv (Europe) Limited: Malta')}</li>
            <li>{it.L('Deriv (MX) Ltd: the Isle of Man')}</li>
            <li>{it.L('Deriv (FX) Ltd: Labuan, Territory of Malaysia')}</li>
            <li>{it.L('Deriv (BVI) Ltd: British Virgin Islands')}</li>
            <li>{it.L('Deriv (V) Ltd: Vanuatu')}</li>
            <li>{it.L('Deriv (SVG) LLC: St. Vincent and the Grenadines')}</li>
            <li>{it.L('Champion Group Ltd: Vanuatu')}</li>
        </ul>

        <h2 data-anchor='contracts'>E. {it.L('Contracts')}</h2>
        <p>{it.L('The Company does not provide a market amongst or between clients for investments, securities, derivatives, or speculations. Each financial contract purchased by a client via this site is an individual agreement between that client and the Company and is not a security, nor is it transferable, negotiable, or assignable to, or with, any third party.')}</p>
        <p>{it.L('Acquisition of financial contracts through this site must be effected in accordance with the terms and conditions presented on the pages of this site. Acquisition of a financial contract is completed when the financial contract has been customised, the premium (or the payout, as the case may be) has been calculated, and payment has been verified.')}</p>

        <h2 data-anchor='clients-liability'>F. {it.L('Client\'s liability')}</h2>
        <p>{it.L('Clients agree to be fully and personally liable for the due settlement of every transaction entered into under their account with the Company. This includes any transactions entered into by members of the client\'s family or entourage who have gained access to the account. Clients are responsible for ensuring that they alone control access to the account, and that no minors are granted access to trading on the website. In any case, clients remain fully liable for any and all positions traded on their account and for any credit card transactions entered into the site for their account. Each client also indemnifies the Company against all costs and losses of any kind whatsoever, as may be incurred by the Company as a result, direct or indirect, of the client\'s failure to perform or settle such a transaction.')}</p>
        <p>{it.L('[_1]In regard to customers of Deriv (MX) Ltd, online gambling debts are enforceable by law in the Isle of Man.[_2]', '<span data-show="eucountry">', '</span>')}</p>
        <p>{it.L('If the client deposits funds via credit or debit card, the client agrees to email or call the Company before placing a chargeback or a retrieval request so the Company can try to retrieve the funds for the client.')}</p>
        <p>{it.L('If the payment processor sends the Company a chargeback or retrieval notification, the Company reserves the right to suspend any or all of the client’s accounts and place a temporary hold on the funds available in it. In that case, any or all of the client’s accounts may remain suspended until the completion of the entire chargeback investigation. The same might apply if the client’s transacting bank initiates the chargeback or retrieval request without the client’s knowledge.')}</p>
        <p>{it.L('If the Company suffers a loss as a result of a chargeback or retrieval request, the client agrees to reimburse the Company the amount before the Company lifts off any limits imposed on any or all of the client’s accounts.')}</p>

        <h2 data-anchor='customer-funds'>G. {it.L('Customer funds')}</h2>
        <p>{it.L('Money collected from clients is not invested in any securities, futures, currencies, derivatives or other investments, on behalf of clients.')}</p>
        <p data-show='eucountry'>{it.L('The Company is required by its licence to inform clients about what happens to the funds that the Company holds on account for clients, and the extent to which funds are protected in the event of insolvency. To learn more, please refer [_1]here[_2].',
            '<a href="http://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('The Company holds customer funds in bank accounts separate from the operational accounts. Deriv (MX) Ltd & Deriv (Europe) Limited have arrangements in place so that in the event of insolvency they are able to meet their obligations to clients. These arrangements are in the form of a loan agreement between each respective company and the parent company, Deriv Limited, this loan will always at minimum cover the client liabilities. This meets the Gambling Commission\'s requirements for the segregation of customer funds at the level of medium protection.')}</p>
        <p>{it.L('The Company has various deposit methods available, each with its own timing for deposits, some of which might not be available for withdrawals. Full details of available methods for deposits and withdrawals, including settlement times, can be seen [_1]here[_2].',
            `<a href='${it.url_for('cashier/payment_methods')}'>`, '</a>')}
        </p>
        <p>{it.L('A client should not use the client\'s account as a banking facility, and deposits should only be made with a view to using funds to place contracts. The Company is not a financial institution, and the client will not receive interest on deposits. Should a client make repeated deposits and withdrawals without placing commensurate contracts, the Company reserves the right to pass on to the client\'s account, without prior notice, any bank charges the Company has incurred before closing the account. The Company also reserves the right to reject the client\'s payouts without prior notice.')}</p>
        <p>{it.L('Transfers between Binary fiat and cryptocurrency accounts are allowed up to a maximum of 2,500.00 USD or equivalent. Fiat and cryptocurrency transfers are also allowed between Binary and MT5 accounts. Charges may apply for every successful transaction.')}</p>

        <h2 data-anchor='refund-policy'>H. {it.L('Refund policy')}</h2>
        <p>{it.L('The Company offers a number of merchant solutions and payment service providers for making online payments. The client will be billed at the time of, or shortly after, making a transaction. The client agrees to pay for all trades that the client purchases via any of the available merchant solutions or payment service providers.')}</p>
        <p>{it.L('All sales of trades are final. The Company does not refund the price charged for entering a trade if the trade is executed.')}</p>
        <p>{it.L('If a trade becomes unavailable after the transaction is made but before the trade is executed, the client may request a refund of the charged price. The Company reserves the right to accept or reject the client’s request after investigating the client’s claim. If technical problems prevent the execution of a trade, for example, if a disruption occurs in the data feeds that the Company cannot readily fix, the Company reserves the right to refund or reverse the trade.')}</p>
        <p>{it.L('Any request for a deposit refund for active accounts will be automatically rejected. If the Company has closed, blocked, or suspended the client’s account (see Section J. Fraud and money laundering), the client may request a refund of the client’s deposit. The Company reserves the right to accept or reject the client’s request after investigating the client’s claim. ')}</p>

        <h2 data-anchor='prohibited-trades'>I. {it.L('Prohibited trades')}</h2>
        <p>{it.L('The Company reserves the right to refuse to do business with, to discontinue to do business with, and to reverse the transactions of clients who engage in any trading activity')}</p>
        <ul className='bullet'>
            <li>{it.L('That contravenes any laws, regulations, instruments, ordinances, or rules that govern the operation of any exchange, financial market, or financial regulatory environment')}</li>
            <li>{it.L('Where the client makes any false or misleading representation to the Company breaching the clauses under Governing laws and jurisdiction')}</li>
            <li>{it.L('With insider knowledge of any financial market or instrument')}</li>
        </ul>
        <p>{it.L('The Company has the discretion to seek information from clients to verify compliance with these terms.')}</p>
        <p>{it.L('The following are conditions of using the website:')}</p>
        <ul className='bullet'>
            <li>{it.L('Any client that is employed in the banking and/or finance sector must only conduct trades through the website with the knowledge of his/her employer and in accordance with the employer\'s policies.')}</li>
            <li>{it.L('Clients agree to comply with the reasonable requests made by the Company for the purpose of verifying compliance with this term.')}</li>
        </ul>
        <p>{it.L('The Company may withhold payment of funds accumulated in a client\'s account while it takes steps to verify compliance with these terms.')}</p>
        <p>{it.L('If the Company (in its sole discretion) is not satisfied that a client is complying with these terms, or if a client does not comply with a reasonable request for information made by the Company, the Company may cancel the client\'s account and withhold any funds accumulated therein.')}</p>

        <h2 data-anchor='fraud-and-money-laundering'>J. {it.L('Fraud and money laundering')}</h2>
        <p>{it.L('No person shall abuse this site for the purpose of money laundering. The Company employs best-practice anti-money laundering procedures. All transactions are checked to prevent money laundering, which may have several effects on clients. The Company reserves the right to refuse to do business with, to discontinue to do business with, and to reverse the transactions of clients who do not accept or adhere to these anti-money laundering processes. Acceptable funds should not originate from criminal activity. The Company is bound to report suspicious transactions to relevant authorities.')}</p>
        <p>{it.L('The anti-money laundering processes have the following effects on clients:')}
            <ul className='bullet'>
                <li>{it.L('Clients must register personally.')}</li>
                <li>{it.L('Clients must fill into the account opening form all requested details that establish their identity. Clients must give a valid identification, address, contact email address, and personal telephone number.')}</li>
                <li>{it.L('The Company may, at its sole discretion or as required by regulations in place conduct appropriate "Know Your Customer" (KYC) procedures and require a client to provide proof of identity and suspend an account until satisfactory evidence of identity and address, source of funds, and/or source of wealth have been provided.')}</li>
                <li>{it.L('In order for a UK resident to make use of the demo account, the client will first have to be age-verified. The client will also need to be fully verified before making use of the real money account. Verification can be done electronically or through submission of KYC documents.')}</li>
                <li>{it.L('Requested KYC documentation could include')}
                    <ul className='bullet'>
                        <li>{it.L('Proof of identity – such as ID card, passport or driving licence')}</li>
                        <li>{it.L('Proof of address – such as bank statements/ building society statement or utility bills (mobile phone bills are unacceptable)')}</li>
                        <li>{it.L('Proof of wealth / Source of funds – such as payslips or bank statements')}</li>
                    </ul>
                </li>
                <li>{it.L('If such documents expire, the Company reserves the right to request updated documentation.')}</li>
                <li>{it.L('The Company also reserves the right to request documentation pertaining to any other legal obligation.')}</li>
                <li>{it.L('Clients agree that the Company may use personal information provided by them in order to conduct appropriate anti-fraud checks. The personal information that clients provide may be disclosed to a credit reference or fraud prevention agency, which may keep a record of that information.')}</li>
                <li>{it.L('Withdrawals may only be paid to the initiator of an account. When a client maintains an account by means of telegraphic deposits, withdrawals are only paid to the holder of the originating bank account, and it is the onus of the client to ensure that account number and name accompany all transfers to the Company. When a client maintains an account by means of credit/debit card deposits, withdrawals are only paid back to the same card.')}</li>
                <li>{it.L('Clients shall not hold or pool third-party funds into their own account held with the Company.')}</li>
                <li>{it.L('It is prohibited to sell, transfer, and/or acquire accounts to/from other clients. Transfer of funds among other clients is also prohibited.')}</li>
                <li>{it.L('Only one account is allowed per person. No withdrawals and/or refunds may be collected on accounts opened in false names or on multiple accounts opened by the same person.')}</li>
                <li>{it.L('The Company has the right and obligation not to accept the information provided by clients if the Company knows or has a reason to believe that it is incorrect, inaccurate, or incomplete. In such cases, the Company may ask clients to clarify or correct the details provided.')}</li>
            </ul>
        </p>

        <h2 data-anchor='company-rights'>K. {it.L('Company\'s rights')}</h2>
        <p>{it.L('The Company does not tolerate any form of inappropriate behaviour. This includes the usage of offensive language. The Company reserves the right to restrict or terminate the client\'s account if there is any form of inappropriate behaviour on the client\'s part.')}</p>
        <p>{it.L('The Company reserves the right to suspend the operation of this site or sections thereof in the following cases:')}
            <ul className='bullet'>
                <li>{it.L('When, as a result of political, economic, military, or monetary events (including unusual market volatility or illiquidity) or any circumstances outside the control, responsibility, and power of the Company, the continued operation of this site is not reasonably practicable without materially and adversely affecting and prejudicing the interests of clients or the Company, or if, in the opinion of the Company, a price cannot be calculated for financial contracts')}</li>
                <li>{it.L('When there is a breakdown in the means of communication normally employed in determining the price or value of any of the financial contracts or where the price or value of any of the financial contracts cannot be promptly or accurately ascertained')}</li>
                <li>{it.L('In any event of an error in current prices, published odds, or trading software')}</li>
            </ul>
        </p>
        <p>{it.L('The Company has and retains the right to terminate any event or trade including, but not limited to, the occurrence of any of the above events.')}</p>
        <p>{it.L('In all circumstances, the Company reserves the right to make changes to these terms and conditions. If the Company elects to make any material changes to these terms and conditions, clients will be notified in advance and shall either accept or decline to agree. Declining to agree shall result in a material breach of this agreement and the client\'s account may be frozen, suspended, or cancelled. However, the client shall be allowed to withdraw any pending balance on account subject to KYC verification.')}</p>
        <p>{it.L('In such an event, the Company may at its sole discretion (with or without notice) close out  the client\'s open financial contracts at prices it considers fair and reasonable.')}</p>
        <p>{it.L('Further, the Company, under the above circumstances, or any other, reserves the right to adjust a client\'s account should any trade result in disruption or in a miscarried or aborted trade.')}</p>
        <p>{it.L('Although the Company has and retains all rights to refuse or to close a client\'s account, the Company does warrant that all contractual obligations already made, shall be honoured.')}</p>
        <p>{it.L('The Company reserves the right to cancel/reverse transactions or amend the contractual terms (including, but not limited to, entry and exit spot) in the case that any contracts are acquired or sold at prices that do not reflect fair market prices or that are acquired or sold at an abnormally low level of risk due to an undetected programming error, bug, or glitch in the Company website software, market data feed or contract pricing latency, data feed error, stray quotes, incorrect pricing parameters, manifest mis-calculation of prices, or other obvious errors ("Manifest Errors"). Clients have a duty to report to the Company any such problems, errors, or suspected system inadequacies that they may experience and may not abuse, or arbitrage based on, such system problems or errors for profit. The Company will endeavour to resolve any such difficulties in the shortest time possible. Any amendments to the contractual terms (including, but not limited to, entry and exit spot) of Manifestly Erroneous contracts shall be reasonable and fair. Monies exchanged between the client and the Company in connection with Manifestly Erroneous contracts shall be returned to the recipient according to the amendments made to the contractual terms (including, but not limited to, entry and exit spot).')}</p>
        <p>{it.L('Clients with insider knowledge of any financial market or instrument are prohibited from trading at this website.')}</p>
        <p>{it.L('Any information given on these pages, and/or emails or newsletters sent by the Company related thereto, is not intended as financial or investment advice and the Company will not accept any liability in this respect.')}</p>
        <p>{it.L('The right is also reserved to amend or change the rules and scope of this service from time to time. Any change to the rules made whilst the site is in operation will not apply retrospectively and will only apply to acquisitions of financial contracts made after such a change. It is the Company\'s responsibility to notify clients before any changes to its terms come into effect.')}</p>

        <h2 data-anchor='dormant-and-inactive-accounts'>L. {it.L('Dormant and inactive accounts')}</h2>
        <p data-show='-eucountry'>{it.L('The company reserves the right to charge a dormant fee of up to 25 USD/EUR/AUD/GBP or equivalent of USD25 in any other currency as calculated in accordance with the current exchange rate published by www.xe.com, or any other recognised data provider, as on the date of charging of the fee, every 6 months for every client account that has had no transaction recorded for over 12 months.')}</p>
        <p data-show='eucountry'>{it.L('The company reserves the right to charge a dormant fee of up to 25 USD/EUR/GBP every six months for every client\'s account that has had no transaction recorded for over 12 months. Clients will be notified before the fee is deducted from the account. Clients need to contact our helpdesk to recover funds from inactive, closed, blocked, or excluded accounts.')}</p>
        <h2 data-anchor='liability'>M. {it.L('Liability')}</h2>
        <p>{it.L('Save in case of negligence, fraud, or default by the Company, the Company will not be liable in any way to any clients in the event of force majeure, or for the act of any government or legal authority, or for the failure of or damage or destruction to its computer systems, data, or records, or any part thereof, or for delays, losses, errors, or omissions resulting from the failure or mismanagement of any telecommunications, computer equipment, or software by the client or any damages or losses deemed or alleged to have resulted from, or been caused by, this site or its content.')}</p>

        <h2 data-anchor='marketing-and-promotion'>N. {it.L('Marketing and promotion')}</h2>
        <p>{it.L('The Company may from time to time inform clients about changes on the website, new services, and promotions. If, however, the client wishes to opt out of such a service and does not wish to receive any direct marketing data, the client can either unsubscribe from the service directly or email the Company\'s customer support team. If the client decides to opt in again into receiving promotional material, the client can also do so by contacting the customer support team.')}</p>

        <h2 data-anchor='account-opening'>O. {it.L('Account opening')}</h2>
        <p>{it.L('A client may only open an account on this site on the following conditions:')}
            <ul className='bullet'>
                <li>{it.L('The client has read this legal Terms and conditions page in full and understood that the client will be buying and selling contracts subject to these terms and conditions.')}</li>
                <li>{it.L('The client has read the Company\'s privacy statement and is aware of how the Company processes information.')}</li>
                <li>{it.L('The client is over 18 years of age, unless the client is an Estonian resident whereby the client would have to be over 21.')}</li>
                <li>{it.L('The client is not resident in a restricted country such as Canada, Hong Kong, Israel, Jersey, Malaysia, Malta, Paraguay, Rwanda, the United Arab Emirates, the USA, or any other restricted country that has been identified by the FATF as having strategic deficiencies.')}</li>
                <li>{it.L('The client has sufficient experience and knowledge in matters of financial trading to be capable of evaluating the merits and risks of acquiring financial contracts via this site and has done so without relying on any information contained on this site.')}</li>
            </ul>
        </p>

        <h2 data-anchor='account-closure'>P. {it.L('Account closure')}</h2>
        <p>{it.L('The client may choose to contact the Company to close the client\'s account held with the Company. The client\'s account may be closed if the client does not have any open trade positions and if the client has complied with the requested "Know Your Client" procedures to enable the client to withdraw any pending funds in the client\'s account.')}</p>
        <p data-show='eucountry'>{it.L('Due to the responsibilities under responsible gaming, [_1] reserves the right to assess and safeguard the client\'s account by excluding the client definitely or indefinitely, based on the company\'s client assessment.', it.website_name)}</p>
    </div>
);

export default Tac;
