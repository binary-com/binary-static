import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const IcoClaimForm = () => (
    <React.Fragment>
        <h1>{it.L('ELECTRONIC SUBSCRIPTION FORM FOR TOKENS')}</h1>

        <h2>{it.L('[_1] (Issuer)', it.broker_name)}</h2>

        <h3>{it.L('CONVERTIBLE DIGITAL TOKENS')}</h3>

        <p>{it.L('Name of Subscriber(s) of Tokens:')}</p>
        <p>
            <input className='center-text claimer_name' type='text' disabled='disabled' placeholder={it.L('Name')} />
        </p>
        <p>{it.L('hereby applies for:')}</p>
        <p>{it.L('Number of Tokens:')}
            <input type='text' className='center-text' disabled='disabled' id='token_count' placeholder={it.L('Token count')} />
            {it.L('convertible digital tokens constituted by an Instrument entered into by the Issuer on 15th November 2017 (<strong>Instrument</strong>) and issued with the benefit of and subject to the provisions contained in the Instrument and the conditions set out in the Instrument (<strong>Conditions</strong>).')}
        </p>
        <p>
            {it.L('Price per Token')}:
            <input type='text' className='center-text' disabled='disabled' id='final_price' placeholder={it.L('Price')} />
        </p>
        <h3>{it.L('Conditions of Application')}</h3>
        <p>{it.L('The Subscriber represents, warrants, acknowledges and agrees that:')}</p>
        <ol>
            <li>{it.L('its offer to subscribe shall be accepted by the Issuer taking payment of the aggregate subscription price for the Tokens applied for, being computed by reference to the final price of the Dutch Auction (the “<strong>Auction</strong>”) as declared by the Issuer, and issuing such Tokens in accordance with the Instrument and the Conditions;')}</li>
            <li>{it.L('if the Subscriber is located or resident in the United Kingdom, it is a person of a kind described in Articles 19, 43 and/or 49 of the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005 (the “<strong>Order</strong>”) or to whom this Subscription Form and any other documents relating to the offer of Tokens may otherwise be lawfully distributed to it pursuant another applicable exemption under the Order and that it understands that this Subscription Form and any other documents relating to the offer of Tokens is only directed at (A) persons who have professional experience in matters relating to investments who fall within the definition of "investment professionals" in Article 19(5) of the Order, (B) persons falling within Article 43(2) of the Order, (C) high net worth entities (including companies and unincorporated associations of high net worth and trusts of high value) or other persons falling within Article 49(2)(a) to (d) of the Order, and (D) persons to whom such information may otherwise be lawfully distributed, and that, accordingly, any investment or investment activity to which this Electronic Subscription Form relates is available only to the Subscriber as such a person or will be engaged in only with the Subscriber as such a person;')}</li>
            <li>{it.L('if the Subscriber is located or resident in the European Economic Area, it is a qualified investor within the meaning of the law in the Relevant Member State implementing Article 2(1)(e)(i), (ii) or (iii) of the Prospectus Directive (Directive 2003/71/EC (and amendments thereto)) (the “<strong>Prospectus Directive</strong>”) or is otherwise able to subscribe to the Tokens under an applicable exemption under the Prospectus Directive; ')}</li>
            <li>{it.L('if the Subscriber is a financial intermediary, as that term is used in Article 3(2) of the Prospectus Directive, any Tokens subscribed for by it will not be acquired on a non-discretionary basis on behalf of, nor will they be acquired with a view to their offer or resale to, persons in a member state of the European Economic Area which has implemented the Prospectus Directive other than qualified investors, or in circumstances in which the prior consent of the Issuer has not been given to the offer or resale;')}</li>
            <li>{it.L('in the normal course of business, the Subscriber invests in or purchases securities similar to the Tokens and has such knowledge and experience in financial and business matters as to be capable of evaluating the merits and risks of its respective investment in the Tokens, and each Subscriber and any accounts for which each Subscriber is acting are each able to bear the economic risk of its investment; ')}</li>
            <li>{it.L('the Subscriber is purchasing the Tokens for its own account or for one or more separate accounts maintained by such Subscriber and not with a view to the distribution thereof, provided that the disposition of such Subscriber’s property shall at all times be within their control; ')}</li>
            <li>{it.L('the Subscriber understands that the Tokens have not been registered under the applicable laws of Australia, the British Virgin Islands, Canada, the European Union, Hong Kong, Japan, Jersey, Malaysia, New Zealand, Singapore, Switzerland, USA, or any other jurisdiction where the extension of the availability of the Tokens would breach any applicable law or regulation (a “<strong>Restricted Territory</strong>”). To the extent that the Subscriber is a resident of any such Restricted Territory or a corporation, partnership or other entity organised under the laws of any such Restricted Territory, it will only subscribe for Tokens pursuant to an available exemption under applicable law; ')}</li>
            <li>{it.L('the Subscriber has not and will not distribute or publish this Electronic Subscription Form or any advertisement or other offering material in relation to the Tokens directly or indirectly in, into or within any Restricted Territory;')}</li>
            <li>{it.L('the Subscriber understands that neither the Tokens nor the Ordinary Shares have been, nor will they be, registered under the U.S. Securities Act of 1933, as amended (the “Securities Act”) and may not be offered or sold within the United States except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the Securities Act. The Subscriber understands that neither the Issuer, its affiliates, nor any person acting on any of their behalf has offered or sold, and will not offer or sell, any Tokens or Ordinary Shares within the United States except in accordance with Regulation S under the Securities Act. Accordingly, neither the Issuer, its affiliates nor any person acting on its or their behalf have engaged or will engage in any directed selling efforts with respect to the Tokens or the Ordinary Shares. Terms used herein have the meanings given to them by Regulation S. Neither the Issuer, its affiliates nor any person acting on behalf of such persons has entered or will enter into any contractual arrangement with respect to the distribution of Tokens or Ordinary Shares in the United States')}</li>
            <li>{it.L('the Subscriber has read and understood the Information Memorandum of the Company dated 15 November 2017 and in particular has read and understood the Risk Factors detailed therein;')}</li>
            <li>{it.L('the Subscriber has observed the laws of all relevant jurisdictions, obtained any requisite governmental exchange controls or other consents, complied with all relevant formalities and paid any issue, transfer or other taxes due in connection with its participation in the Auction in any applicable territory and that it has not taken any action which will or may result in the Issuer being in breach of the legal or regulatory requirements of any jurisdiction;')}</li>
            <li>{it.L('the Subscriber holds an account on the [_1] website, with an account identifier that shall be identified as the initial holder of the Tokens, and that Subscriber has satisfactorily completed KYC (Know Your Client), AML (Anti-Money Laundering) procedures, and has accurately updated his or her name, address, country of residence, and ID details in such account;', it.website_name)}</li>
            <li>{it.L('the Subscriber understands that the Tokens are a risky investment, that he/she is investing entirely at his/her own risk, and may lose the entirety of his/her investment; and')}</li>
            <li>{it.L('the Tokens will be issued on, and the Subscriber will be bound by, the Instrument and the Conditions, including the representations made herein')}</li>
        </ol>
        <p>{it.L('Electronically signed by the Subscriber/for and on behalf of the Subscriber')}</p>
        <p>
            <input type='text' disabled='disabled' className='center-text claimer_name' id='name' placeholder={it.L('Name')} />
        </p>
        <p>{it.L('Subscriber')}</p>
        <p>{it.L('Date')}: <input type='text' disabled='disabled' className='center-text' id='date_today' placeholder={it.L('Date')} /></p>

        <SeparatorLine className='gr-padding-10' invisible show_mobile />

        <div className='center-text gr-centered'>
            <button className='button' type='submit'>{it.L('Agree')}</button>
            <a className='button button-secondary' id='cancel' href='javascript:;'><span>{it.L('Return')}</span></a>
        </div>
    </React.Fragment>
);

export default IcoClaimForm;
