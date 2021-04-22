import React from 'react';
import BIEL from './biel.jsx';

export const Li = ({
    dataShow,
    title,
    subtitle,
    sub_list,
    paragraph,
    children,
}) => (
    <li data-show={dataShow}><strong>{title}</strong> {subtitle && <span>&mdash; {subtitle}</span>}
        {sub_list && <ol>{sub_list.map(list => <li key={list}>{list}</li>)}</ol>}
        {paragraph && <p>{paragraph}</p>}
        {children}
    </li>
);

const TermsAndConditions = () => (
    <div id='mt-tnc'>
        <h2 data-anchor='introduction-and-scope-of-agreement'>{it.L('A. Introduction and scope of agreement')}</h2>
        <ol>
            <li>
                {it.L('Depending on the jurisdiction to which a client\'s account has been attached in accordance with the account opening procedures of the website, the terms \'the Company\' and \'[_1]\' shall denote either', it.website_name)}&nbsp;
                <span data-show='-eucountry'>{it.L('Deriv (V) Ltd,')}&nbsp;</span>
                <span data-show='-eucountry'>{it.L('Deriv (SVG) LLC,')}&nbsp;</span>
                <span data-show='-eucountry'>{it.L('Deriv (BVI) Ltd,')}&nbsp;</span>
                <span data-show='-eucountry'>{it.L('Deriv (FX) Ltd,')}&nbsp;</span>
                <span>{it.L('Deriv (Europe) Limited, or')}&nbsp;</span>
                <span>{it.L('Deriv Investments (Europe) Limited.')}</span>
            </li>

            <li data-show='eucountry default'>{it.L('The client understands that products based on a random number generator (the "Synthetic Indices") are gaming products whereas products based on financial market indices (forex, stock indices, and commodities) are financial instruments.')}</li>
            <li>{it.L('All products traded on Margin carry a high degree of risk and can result in losses that exceed the client\'s initial deposit. The Margin trading services described in this agreement are not suitable for everyone. The client acknowledges that the Margin trading services described in this agreement are designed for the clients who are knowledgeable and experienced in the types of transactions described in this agreement, and the client fully understands the associated risks before entering into this agreement with the Company.')}</li>
            <li>{it.L('The client should not sign up to receive the Margin trading services described in this agreement without understanding their nature and the associated risks.')}</li>
            <li>{it.L('This agreement is supplied to the client in English. In the event that there is a difference between the English version and any translated versions of this document, the English version shall prevail.')}</li>
            <li>{it.L('A glossary of the capitalised terms can be found in paragraph R, entitled "Interpretation of terms".')}</li>
        </ol>

        <h2 data-anchor='commencement'>{it.L('B. Commencement')}</h2>
        <ol>
            <li>{it.L('This agreement will commence on the date that the client receives their MT5 Real Account number and, for any new versions thereafter, on the date the new versions are published on the Company\'s website.')}</li>
        </ol>

        <h2 data-anchor='provision-of-services'>{it.L('C. Provision of services')}</h2>
        <ol>
            <li>{it.L('The Company mainly provides contracts for difference (CFDs) via MT5 platform.')}</li>
            <li>{it.L('The provision of the Margin trading services described in this agreement utilises a third-party system, acquired via a non-exclusive, non-transferable, non-sublicensable, and terminable licence from the third-party system provider/licensor (the "MT5 trading platform"). The client acknowledges that the Company reserves the right to change the third-party system provider/licensor during the course of providing the Margin trading services described in this agreement to the client.')}</li>
            <li>{it.L('[_1] shall act purely on an execution-only basis.', it.website_name)}</li>
            <li>{it.L('[_1] shall also act at times as a principal and at other times as an agent on the client\'s behalf for all transactions entered into by the client, depending on the company that the client has opened their account with.', it.website_name)}</li>
            <li>{it.L('The Company will hold the client responsible for all their obligations under this agreement in the Company\'s course of providing the Margin trading services that are described in this agreement to the client even if the client notifies the Company that they are acting as the agent of an identified principal.')}</li>
        </ol>

        <h2 data-anchor='account-management'>{it.L('D. Account management')}</h2>
        <ol>
            <li>{it.L('Opening an account')}
                <ol>
                    <li>{it.L('[_1] offers a variety of MT5 Real Accounts depending on the jurisdiction to which a client’s [_1] account has been attached subject to any verification or authentication requirements.', it.website_name)}</li>
                    <li>{it.L('By opening an MT5 Real Account with [_1], the client represents, warrants, and undertakes the following:', it.website_name)}
                        <ol>
                            <li>{it.L('The client is acting for their sole benefit, and not for or on behalf of any other person.')}</li>
                            <li>{it.L('The client has read these terms and conditions in full and has understood that they will be buying and selling financial contracts subject to these terms and conditions.')}</li>
                            <li>{it.L('The client has sufficient experience and knowledge about contracts for difference to be capable of evaluating the merits and risks of acquiring contracts via this site and have done so without relying on any information contained in this site.')}</li>
                        </ol>
                    </li>
                    <li>{it.L('The Company reserves the right to refuse the client\'s request to open an MT5 Real Account for any reason, and any MT5 Real Account may be closed at the Company\'s discretion at any time upon 7-day notice.')}</li>
                </ol>
            </li>
            <li data-show='eucountry' >{it.L('Assessment of appropriateness')}
                <ol>
                    <li>{it.L('In the course of providing services, the Company may, where applicable, conduct an appropriateness test, in accordance with the Company\'s regulatory obligations, in order to determine whether the client, in the Company\'s view and on the basis of the information provided by the client, possesses the necessary knowledge and experience in the investment field to understand the risks involved in the specific type of product or service offered or demanded.')}</li>
                    <li>{it.L('If the Company considers, on the basis of the information provided by the client, that the client does not possess the knowledge and experience to appreciate the risks associated with an investment in the proposed instrument, the Company will issue a warning to the client. Such a warning shall be displayed on the website.')}</li>
                    <li>{it.L('In accordance with applicable regulatory requirements, if the Company does not manage to obtain sufficient information to assess the appropriateness of the product or service for the client, the Company will similarly inform the client that [_1] is not in a position to assess appropriateness.', it.website_name)}</li>
                </ol>
            </li>
            <li>{it.L('Fund transfers')}
                <ol>
                    <li>{it.L('Funding of MT5 Real Account')}
                        <ol>
                            <li>{it.L('The client\'s MT5 Real Account shall be funded by transferring funds from their [_1] account, subject to the availability and sufficiency of funds in their [_1] account and any daily transfer limits. No fund transfers shall be made to any other account in the name of any third party.', it.website_name)}</li>
                            <li>{it.L('All fund transfers from the client\'s [_1] account to their MT5 Real Account must be made by the client.', it.website_name)}</li>
                            <li>{it.L('There will be no charges for fund transfers from the client\'s [_1] account to their MT5 Real Account in the same currency. Should the client\'s [_1] account and MT5 Real Account be in different currencies, the Company reserves the right to charge a currency conversion fee.', it.website_name)}</li>
                        </ol>
                    </li>
                    <li>{it.L('Withdrawal of funds from MT5 Real Account')}
                        <ol>
                            <li>{it.L('Subject to the availability and sufficiency of funds in their MT5 Real Account and any daily transfer limits, the client may withdraw funds from their MT5 Real Account to their [_1] account.', it.website_name)}</li>
                            <li>{it.L('The Company may, however, withhold the client\'s withdrawal request from their MT5 Real Account to their [_1] account, in whole or in part, in one or more of the following cases:', it.website_name)}
                                <ol>
                                    <li>{it.L('The client has unrealised losses on their MT5 Real Account.')}</li>
                                    <li>{it.L('Such a withdrawal would result in the client\'s Account Equity being less than zero.')}</li>
                                    <li>{it.L('The Company reasonably considers that funds may be required to meet any Margin Requirement.')}</li>
                                    <li>{it.L('There is an amount outstanding from the client to the Company.')}</li>
                                    <li>{it.L('The Company is required to do so in accordance with any relevant law or regulation.')}</li>
                                </ol>
                            </li>
                            <li>{it.L('Withdrawal of funds from the client\'s MT5 Real Account can be made in a different currency from the one maintained in the client\'s [_1] account subject to a currency transfer fee charge.', it.website_name)}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('Accounts with debit balance (i.e. credit exposure to [_1])', it.website_name)}
                <ol>
                    <li>{it.L('The Company does not offer credit to its clients. The client acknowledges and agrees that they will not be dealing with the Company on credit.')}</li>
                    <li>{it.L('Accounts with debit balances are required to settle the full amount immediately by making a payment to [_1].', it.website_name)}</li>
                    <li>{it.L('If the client fails to immediately make a full settlement of the sum due to the Company in accordance with this agreement, the Company reserves the right to accrue interest on the sums due from the client to the Company in respect of any transaction that the client fails to pay on the relevant due date. Interest will accrue on a daily basis from the relevant due date until the date on which payment is received in full at the bank\'s official base rate for short term funds determined by the Company and will be payable on demand.')}</li>
                </ol>
            </li>
            <li data-show='eucountry'>{it.L('Self-exclusion limits')}
                <ol>
                    <li>{it.L('When a self-exclusion limit is set on the client\'s [_1] account, the client\'s MT5 Real Account will be disabled until the self-exclusion limit on their [_1] account is removed.', it.website_name)}</li>
                    <li> {it.L('Due to the responsibilities under responsible gaming, the Company reserves the right to assess and safeguard the client\'s account by setting limits to the client\'s activity as deemed proportionate and necessary for their protection.')}</li>
                    <li>{it.L('In relation to 5.2, the Company also reserves the right to exclude the client definitely or indefinitely, based on the Company\'s client assessment.')}</li>
                </ol>
            </li>
            <li>{it.L('Account security')}
                <ol>
                    <li>{it.L('By adhering to the following measures, the Company is committed to making sure that the client\'s personal data and transactions are secure:')}
                        <ol>
                            <li>{it.L('The client\'s MT5 Real Account password and login ID are unique, and passwords are hashed so that not even [_1] staff can read them. This is the reason why the Company cannot retrieve the client\'s password and has to send a link for setting a new password to the client\'s email if they cannot recall their password.', it.website_name)}</li>
                            <li>{it.L('It is the client\'s responsibility to keep their password and login ID confidential. The client agrees not to disclose their password and login ID to any other person.')}</li>
                            <li>{it.L('The Company\'s information security policies are based on industry best practices in access control and business continuity.')}</li>
                            <li>{it.L('The Company uses identity verification services and real-time fraud detection measures to help protect the client from unauthorised access to their account. The Company also monitors account activity for signs of unusual activity that might indicate fraud and works with collection agencies and law-enforcement agencies to address fraud issues.')}</li>
                            <li>{it.L('The Company will rely on the transactions and other instructions entered into and/or given by the client\'s username and password, and the client is bound by any transaction or expense incurred in reliance on such Orders and/or instructions.')}</li>
                            <li>{it.L('The client is to immediately notify the Company if they become aware of the loss, theft, or disclosure to third parties of their login details.')}</li>
                            <li>{it.L('If the Company believes that unauthorised persons are using an account, it reserves the right to suspend the client\'s right to use the trading facility without prior notice.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('Closing an account')}
                <ol>
                    <li>{it.L('If the client wishes to withdraw funds from their MT5 Real Account and close their MT5 Real Account, they may notify the Company via [_1]live chat[_2]. The client\'s MT5 Real Account may be closed if they do not have any Open Positions and all the amounts that were due to the Company have been settled.', `<a href=${it.url_for('contact')} target="_blank">`, '</a>')}</li>
                    <li>{it.L('If the client\'s [_1] account is closed, their MT5 Real Account will be automatically closed as well.', it.website_name)}</li>
                    <li>{it.L('Client\'s demo accounts will be deleted after [_1] days of inactivity.', '30')}</li>
                    <li>{it.L('Real accounts will be archived after [_1] days of inactivity. The client can request for the reactivation of a real account via [_2]live chat[_3].', '30', `<a href=${it.url_for('contact')} target="_blank">`, '</a>')}</li>
                    <li>{it.L('Any pending funds in your MT5 account will be transferred to your Binary account.')}</li>
                </ol>
            </li>
        </ol>

        <h2 data-anchor='orders'>{it.L('E. Orders')}</h2>
        <ol>
            <li>{it.L('Order execution/cancellation/modification')}
                <ol>
                    <li>{it.L('The client acknowledges that it is their responsibility to understand the features, characteristics, terms, and conditions of an Order and the implications of executing an Order before they place an Order with the Company.')}</li>
                    <li>{it.L('Subject to network latency, the Company endeavours to execute the client\'s Order within a reasonable time from the time that they trigger the Order, at the price nearest to the client\'s specified price. The Company does not guarantee that a transaction will be opened/closed following an Order being triggered by the client at their specified price. This can happen under certain trading conditions when there are sharp price movements in the market. In that case, the Company has the right to execute the Order at the first available price.')}</li>
                    <li>{it.L('The Company endeavours to open or close the transaction to which the client\'s Order relates at a price reasonably available to the Company, acting in accordance with the Company\'s duty of best execution. Best execution means that, when executing Orders, the Company must take all sufficient steps to obtain the best possible result for the client, taking into account the price, costs, speed, likelihood of execution and settlement, size, nature, or any other consideration relevant to the execution of the Order.')}</li>
                    <li>{it.L('The Company Prices are determined by reference to the price of the Underlying Instrument which is quoted on external exchanges or dealing facilities that [_1] selects at the Company\'s discretion. The Company\'s IT infrastructure and price aggregator system facilitate the reception of quotes from shortlisted prime brokers, who act as liquidity providers for the Company and the delivery of the quotes, derived with reference against relevant benchmark and markets, to the client. The client acknowledges that the Company Prices may differ from the Bids and Asks made available by external exchanges or dealing facilities and the Company is not liable for any losses that the client might incur arising from such differences. This clause does not apply to Synthetic Indices.', it.website_name)}</li>
                </ol>
            </li>
        </ol>
        <h2 data-anchor='types-of-orders'>{it.L('Types of Orders')}</h2>
        <ol>
            <li><h4>{it.L('Market Orders')}</h4>
                <p>{it.L('A Market Order is an Order to buy or sell at the available market price, which results from the aggregation of prices and volumes received from third-party liquidity providers.')}</p>
            </li>
            <li><h4>{it.L('Pending Orders')}</h4>
                <p>{it.L('A Pending Order is the trader\'s instruction to a brokerage company to buy or sell a security in future, under pre-defined conditions, when price reaches a specific level.')}</p>
                <ol>
                    <li>{it.L('The Company may, at its absolute discretion, accept a Stop Order, a Limit Order, or a Stop Limit Order from the client.')}</li>
                    <li>{it.L('The client may specify their instruction of a Stop Order or apply for a Limit Order for a limited duration or for an indefinite period (a "good till cancelled" or "GTC" Order).')}
                        <ol>
                            <li>{it.L('In the case of a Stop Order, the client acknowledges that the Company will endeavour to fill the Order at a price equal to the one that the client has specified. However, if the price is unavailable, the next available price may be quoted. In other words, the Order is executed at either the price equal to the specified one or the next available price (slippage). The execution of Stop Orders is guaranteed.')}</li>
                            <li>{it.L('In the case of a Limit Order, the client acknowledges that the Company will endeavour to fill the Order at a level that is the same or better than the Limit the client has specified, subject to the availability of the Limit Price.')}</li>
                        </ol>
                    </li>
                    <li>{it.L('Stop Limit Orders are a combination of Stop and Limit Orders. If the price reaches (or passes) the Stop Price, a Limit Order is placed at the specified price, which will be filled at a price equal or better than the specified price. ')}</li>
                    <li>{it.L('A Take Profit Order is intended for gaining profit when the financial instrument price has reached a certain level. Execution of this Order results in the complete closing of the whole position. It is always connected to an Open Position or a Pending Order.')}</li>
                    <li>{it.L('A Stop Loss Order is intended for minimising losses when the financial instrument price moves in an unprofitable direction. The execution of this Order results in the complete closing of the whole position. It is always connected to an Open Position or a Pending Order.')}</li>
                    <li>{it.L('The client may not cancel or amend the level of their Stop and Limit Order once the level has been reached.')}</li>
                    <li>{it.L('The client acknowledges that it is their responsibility to cancel the Stop or Limit Order if they do not want the Stop or Limit Order to remain valid. If the client fails to cancel the Stop or Limit Order, the Company shall be entitled, at its absolute discretion, to treat the Stop or Limit Order as an instruction to enter into a new transaction for the client if and when the Company quote reaches or goes beyond the level of the Stop or Limit Order.')}</li>
                    <li>{it.L('The client acknowledges that the Company reserves the right to establish a minimum and maximum transaction size, as well as a total net position size, which may be subject to alteration, and that the Company will only execute Orders that fall within the range of the minimum and maximum transaction sizes.')}</li>
                    <li>{it.L('The Company may, at its absolute discretion, disregard the client\'s Order if an Event takes place resulting in it no longer being practicable to act on the client\'s Order after indicating an acceptance of their Order.')}</li>
                </ol>
            </li>
        </ol>
        <h2 data-anchor='margin'>{it.L('F. Margin and Leverage')}</h2>
        <ol>
            <li>{it.L('General provisions')}
                <p>{it.L('The Margin used in Margin calculations will be whichever is bigger: the Margin implied by the account\'s Leverage or the symbol\'s Margin. The account has a specific Margin, but symbol\'s Margin may vary. ')}</p>
                <ol>
                    <li>{it.L('Prior to placing an Order, which results in opening a position, the client acknowledges that it is their responsibility to ensure that their Account Free Margin is sufficient to cover the Margin required in relation to the opening of the position (the "Margin Requirement"), and to continuously meet the Margin Requirement.')}</li>
                    <li>{it.L('To maintain Open Positions, the client is required to have sufficient Account Equity to cover any Margin Requirement. If a client\'s Margin Level is less than the Margin Level set for their account, the client has entered into a Margin Call and is required to increase their Margin Level above the account\'s specified level in order to avoid a Stop Out to occur. The client may not be able to place an Order to open a transaction unless there is sufficient Account Equity to cover the Total Margin.')}</li>
                    <li>{it.L('The client acknowledges that it is their responsibility to monitor their Account Balance and Margin Requirement, and the Company is not under any obligation to keep the client informed (i.e. to make a Margin Call).')}</li>
                </ol>
            </li>
            <li>{it.L('Margin Requirement and calculation')}
                <p>
                    <ol>
                        <li>{it.L('Margin Requirement is the amount that the client needs to have in their account prior to entering into a trade and it is a percentage of the value of that trade. Margin Requirement will continue to increase/decrease in accordance with the volume and direction of the Open Positions.')}</li>
                        <li>{it.L('The Company may modify Margin Requirements for any Open Positions or new Orders at its sole discretion. Formulas for Margin Requirements published on the website are indicative only and may be changed by the Company at its discretion at any time, due to changing market conditions or other factors.')}</li>
                        <li>{it.L('Whilst the Company endeavours to close out the client\'s Open Positions if and when the Margin Level for their MT5 Real Account reaches or falls below the Stop Out Level, the company does not guarantee that the client\'s Open Positions will be closed when the Margin Level for their MT5 Real Account reaches the Stop Out Level.')}</li>
                        <li>{it.L('For fully covered accounts, no Margin will be charged on open positions. However, swaps and other applicable fees can cause the client\'s Account Equity to turn negative. In that case, the Stop Out process will be triggered.')}</li>
                        <li>{it.L('The Company reserves the right to charge the Margin per each hedged lot of a position.')}</li>
                    </ol>
                </p>
            </li>
            <li>{it.L('Stop Out Level')}
                <ol>
                    <li>{it.L('If the Margin Level for the client\'s MT5 Real Account reaches or falls below the Stop Out Level, this will be classified as an Event of Default. In such circumstances, Open Positions are automatically closed in the following order: (i) the server analyses those Orders that are not under execution at the moment; (ii) the server deletes Orders with the largest Margin; (iii) if the client\'s Margin Level is still under the Stop Out Level, the next Order is deleted (Orders without Margin Requirements are not deleted); (iv) if the client\'s Margin Level is still under the Stop Out Level, the server closes a position with the largest loss; (v) Open Positions are closed until the client\'s Margin Level becomes higher than the Stop Out Level. Additionally, for fully hedged positions, Stop Out will be performed on accounts having Open Positions, zero Margin (positions are covered), and negative equity.')}</li>
                    <li>{it.L('The default Stop Out Level applicable to the client\'s account is published on the Company website. However, the default Stop Out Level is subject to alteration at the Company\'s absolute discretion. Any changes to the Stop Out Level will take effect immediately. The Company will endeavour to notify the client of an alteration to the default Stop Out Level by publishing the revised default Stop Out Level on the Company website. It is the client\'s responsibility to check the Company website regularly and remain informed about the default Stop Out Level.')}</li>
                    <li>{it.L('The Stop Out Level applicable to the client\'s MT5 Real Account may differ from the default Stop Out Level published on the Company website.')}</li>
                </ol>
            </li>
            <li>
                {it.L('Negative Balance Protection')}
                <p>{it.L('The Company has a Stop Out policy which prevents the client from losing more than they have deposited. However, in the event that the client\'s Open Positions are not closed when the Margin Level for their MT5 Real Account reaches the Stop Out Level, the Company, at its sole discretion, may waive the client\'s negative balance by crediting their account if their Account Balance goes into a negative balance. The negative balance is determined by aggregating all the negative balances incurred over a 24-hour period across all accounts held by the client. The client acknowledges that, unless they are a retail customer of Deriv Investments (Europe) Limited, a client of Deriv (Europe) Limited, or a retail customer residing in Australia, the offer of the negative balance protection by the Company to the client is at the Company\'s sole discretion and the Company reserves the right to change the features and eligibility criteria of the negative balance protection at any time. The provisions of the negative balance protection do not apply in the following situations:')}
                    <ol>
                        <li>{it.L('When a force majeure event occurs')}</li>
                        <li>{it.L('When the market conditions or market movements/volatility are abnormal')}</li>
                        <li>{it.L('When the client opens any transactions in relation to Prohibited Trades')}</li>
                        <li>{it.L('When the client is a professional client')}</li>
                        <li>{it.L('Where the negative balance is connected to or a result of functional limitations and/or malfunction of the MT5 trading platform')}</li>
                        <li>{it.L('When a negative balance results from the breach of any of the terms of this agreement by the client')}</li>
                    </ol>
                </p>
            </li>
            <li>{it.L('Transfer of funds')}
                <ol>
                    <li>{it.L('The client may make Margin Payments by transferring funds from their [_1] account to their MT5 Real Account. In the event that there are insufficient funds in the client\'s [_1] account to fund their MT5 Real Account, they may make Margin Payments by funding their [_1] account and transferring the funds from their [_1] account to their MT5 Real Account.', it.website_name)}</li>
                    <li>{it.L('Margin Payments are due immediately and shall be received in full by the Company.')}</li>
                </ol>
            </li>
        </ol>

        <h2 data-anchor='regulatory-provisions'>{it.L('G. Regulatory provisions')}</h2>
        <ol>
            <li>{it.L('Potential conflicts of interest')}
                <ol>
                    <li>{it.L('The Margin trading services described in this agreement are conducted over the counter ("OTC"). ')}</li>
                    <li>{it.L('The client acknowledges that the Company will determine, at its discretion, the transactions that will be kept in the Company\'s own book (known as B booking) and the transactions that will be passed through to the prime brokers who act as liquidity providers for the Company (known as A booking). For the former, the Company is the counterparty in these transactions, and a correlation exists between the profit/loss made by the client and the profit/loss made by the Company. At any point in time, the Company may be entering into or may have entered into transactions with a large number of clients, each of whose interests may diverge from those of other clients. As such, the Company may be holding Open Positions that may not be aligned with the client\'s objectives/interests as an individual client of the Company.')}</li>
                    <li>{it.L('Whilst the Company endeavours to take all reasonable and sufficient steps, as required by applicable laws and regulations, to identify potential conflicts of interests between the Company and its clients, or between one client and another, that arise in the course of providing the Margin trading services as described in this agreement by establishing and implementing policies and procedures, it is possible that the Company may execute certain Orders which may have other direct or indirect material interests.')}</li>
                    <li>{it.L('Given the Company\'s role as a Margin trading service provider as described in this agreement, the Company seeks to avoid undue market influence to the extent consistent with the client\'s trading needs and the Company\'s risk management policies and procedures. By continuing to use the Margin trading services described in this agreement, the client acknowledges that they are aware of the potential conflict of interest disclosed that may arise and cannot be completely eliminated, and they consent to the Company acting notwithstanding such potential conflict of interests.')}</li>
                </ol>
            </li>
            <li>{it.L('Client money')}
                <ol>
                    <li>{it.L('The money collected from clients is not invested in any securities, futures, or other investments on behalf of clients.')}</li>
                    <li>{it.L('The Company holds customer funds in bank accounts separate from the operational accounts, and arrangements have been made to ensure that the assets in the customer accounts will be distributed to the customers in the event of insolvency.')}</li>
                </ol>
            </li>
        </ol>

        <h2 data-anchor='quotes'>{it.L('H. Quotes')}</h2>
        <ol>
            <li>{it.L('Quote provision')}
                <ol>
                    <li>{it.L('A higher price (Ask), at which a client can buy, and a lower price (Bid), at which a client can sell, are quoted for each financial instrument, and they are referred to as Company Prices. The difference between the Bids and Asks is called the Spread.')}</li>
                    <li>{it.L('The Spread is subject to alteration, at the Company\'s absolute discretion. The client acknowledges that whilst the Company endeavours to maintain a competitive Spread, it may widen significantly in some circumstances, and such figures will be determined by the Company at its reasonable discretion. Spreads may be widened at the daily bank rollovers.')}</li>
                    <li>{it.L('All prices for financial instruments quoted on the Company website are real market prices and are hereby regarded as firm prices. Any slippage from the shown price during the execution of the Order is considered as consequential. Slippage may increase significantly at the daily bank rollovers. The client acknowledges that, by accepting this agreement, no frivolous quote is being offered to the client by the Company.')}</li>
                </ol>
            </li>
        </ol>

        <h2 data-anchor='trading-transactions'>{it.L('I. Trading')}</h2>
        <ol>
            <li>{it.L('Opening a trade')}
                <ol>
                    <li>{it.L('A trade is opened by either executing a "Buy" or a "Sell" Order based on a specified number of lots (volume) that constitute the Underlying Instrument of the relevant market.')}</li>
                    <li>{it.L('Any trade opened by the client must be within the available balance or limits in effect with respect to MT5 Real Account or any transactions.')}</li>
                </ol>
            </li>
            <li>{it.L('Closing a trade')}
                <ol>
                    <li>{it.L('General provisions')}
                        <ol>
                            <li>{it.L('In order to profit from trading rate, it is necessary to close the position. To close a position, a trade operation opposite to the first one is executed.')}</li>
                            <li>{it.L('An Open Position may be closed by clicking the button "x".')}</li>
                            <li>{it.L('An Open Position may be partially closed by double clicking the position, selecting the volume to be partially closed from the context menu, and then clicking "Close".')}</li>
                            <li>{it.L('Upon closing a trade, the realised profit (or loss), which is represented by the difference between the opening level and closing level of the trade multiplied by the number of lots (volume), becomes due and payable by the Company to the client (or due and payable by the client to the Company in cases of realised loss).')}</li>
                        </ol>
                    </li>
                    <li>{it.L('Trading rules')}
                        <ol>
                            <li>{it.L('The client acknowledges and accepts that a trade may be subject to market rules laid down in by-laws, rules, provisions, customs, and practices of an exchange, a market, a clearing house, a body, or any other organisation involved in the execution, clearing, and/or settlement of the said trade. Should any such organisation take decisions or measures which affect a trade or an Open Position, the Company shall be entitled to take any action (including closing any Open Position of the client) that it, at its sole discretion, considers reasonable. ')}</li>
                            <li>{it.L('The client acknowledges and agrees that the Company may, at any time without prior notice and at its discretion, change the trading rules in relation to the following:')}
                                <ol>
                                    <li>{it.L('Non-trading hours (e.g. the hours over the weekend during which trading of certain transactions are not possible)')}</li>
                                    <li>{it.L('The minimum, incremental, and maximum Order amount')}</li>
                                    <li>{it.L('Margin Requirement')}</li>
                                    <li>{it.L('The instruments available on the electronic trading platform (including their availability for trading)')}</li>
                                    <li>{it.L('The cut-off time for performing Roll-overs and any long or short position swap charges')}</li>
                                </ol>
                            </li>
                            <li>{it.L('Parts of this clause may not apply to Synthetic Indices.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
        </ol>

        <h2 data-anchor='electronic-trading-platform-and-transactions'>{it.L('J. Electronic trading platform and transactions')}</h2>
        <ol>
            <li>{it.L('All intellectual property rights in the MT5 trading platform are owned by the licensor and shall remain the exclusive property of the licensor. Nothing in this agreement intends to transfer any such rights or to vest any such rights in the client.')}</li>
            <li>{it.L('The client\'s use of the MT5 trading platform, whether accessed through or downloaded from the Company website or a third-party website, is governed by the terms of use provided by the MT5 trading platform licensor to the client. In the event of any conflict between the content of this agreement and the agreement between the client and the MT5 trading platform licensor, the terms of this agreement shall prevail. It is the client\'s responsibility to ensure that the information technology that they use is compatible with the required information technology to support the MT5 trading platform.')}</li>
            <li>{it.L('The client acknowledges, understands, represents, and warrants that they are aware of the functional limitations of the MT5 trading platform (for example Wine, which is not a fully stable application, as disclosed by the MT5 trading platform licensor on their website).')}</li>
            <li>{it.L('The Company will act on any instructions given, or appearing to be given, by the client and received by the Company in relation to the Margin trading services provided through the MT5 trading platform, as deemed instructed by the client. However, it is not the Company\'s obligation to act on any instructions deemed given by the client, and the Company is not obligated to give the client any reasons for declining to do so. Instructions received by the Company from the client are deemed final and will not be revocable. It is the client\'s responsibility to ensure the genuineness and accuracy of the instructions given by them to the Company.')}</li>
            <li>{it.L('The Company will use reasonable endeavours within its control to ensure that all electronic data provided on the MT5 trading platform and all electronic transactions instructed by the client and accepted and executed by the Company are not subject to network latency.')}</li>
            <li>{it.L('The client hereby agrees that they will not participate in any illegal, deceptive, misleading, or unethical practices including, but not limited to, disparagement of the MT5 trading platform or other practices which may be detrimental to the MT5 trading platform, the licensor, or public interest.')}</li>
            <li>{it.L('The Company sources market data from prime brokers who act as liquidity providers, thus executing the client\'s transactions through a pool of aggregated liquidity from top tier banks. The services offered by the Company do not include physical delivery of foreign currency by the Company or the prime brokers to the client. The client acknowledges and agrees that such data is proprietary to the Company and any such provider, and the client will not retransmit, redistribute, publish, disclose, or display in whole or in part such data to third parties. The client represents and warrants that they will only use such data for purposes of facilitating their entry into transactions with the Company on the client\'s MT5 Real Account in accordance with this agreement and not for any other purpose. This clause does not apply to Synthetic Indices.')}</li>
        </ol>

        <h2 data-anchor='event-of-default'>{it.L('K. Event of Default')}</h2>
        <ol>
            <li>{it.L('Each of the following events constitute an "Event of Default":')}
                <ol>
                    <li>{it.L('The client passes away, becomes incapacitated, becomes of unsound mind, is unable to pay debts as they fall due, or goes bankrupt or becomes insolvent, as defined under any bankruptcy or insolvency law applicable to the client if the client is an individual.')}</li>
                    <li>{it.L('The Margin Level of the client\'s MT5 Real Account reaches or falls below the Stop Out Level.')}</li>
                    <li>{it.L('The client acts in breach of any warranty or representation made under this agreement, and/or any information provided to the Company in connection with this agreement is, or becomes, untrue or misleading.')}</li>
                    <li>{it.L('The client\'s debts are not settled as, and when, they fall due.')}</li>
                </ol>
            </li>
            <li>{it.L('Rights on Default')}
                <ol>
                    <li>{it.L('On the occurrence of an Event of Default, the Company may exercise its rights under this clause, at any time and without prior notice:')}
                        <ol>
                            <li>{it.L('Closing or partly closing all, or any, of the client\'s Open Positions based on the prevailing prices available in the relevant markets')}</li>
                            <li>{it.L('Suspending the client\'s MT5 Real Account and refusing to execute any Orders to enter into further transactions with the client')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('In the event of the client failing to transfer funds to the client\'s MT5 Real Account, the Company may, at its absolute discretion, allow the client\'s Open Positions to remain open and allow the client to place new Orders to open a transaction. The client acknowledges that, when their Open Positions are allowed to remain open, they may incur further losses.')}</li>
        </ol>

        <h2 data-anchor='manifest-error'>{it.L('L. Manifest Error')}</h2>
        <ol>
            <li>{it.L('[_1] reserves the right to void or amend the contractual terms of any transactions that the Company reasonably believes are entered into at prices that do not reflect fair market prices or that are entered into at an abnormally low level of risk due to an obvious or palpable error (a "Manifest Error"). In deciding whether an error is a Manifest Error, the Company may take into account any relevant information, including the state of the underlying market at the time of the error and any error within, or lack of clarity of, any information source or pronouncement. The client has a duty to report to the Company any such problems, errors, or suspected system inadequacies that The client may experience and may not abuse or arbitrage such system problems or errors for profit. The Company will endeavour to resolve any such difficulties in the shortest time possible.', it.website_name)}</li>
            <li>{it.L('Any amendments to the contractual terms of Manifestly Erroneous contracts shall be reasonable and fair and may involve closing and/or opening of positions, placing/deleting Orders without the client\'s involvement, making changes in Open Positions, deleting trades from trading history, etc. Monies exchanged between the client and the Company in connection with the Manifestly Erroneous contracts shall be returned to the recipient according to the amendments made to the contractual terms and conditions of this agreement.')}</li>
        </ol>

        <h2 data-anchor='force-majeure-events'>{it.L('M. Force majeure events')}</h2>
        <ol>
            <li>{it.L('A force majeure event, if and when determined, means, (i) the Company, by reason of force majeure or act of state, is prevented from, hindered, or delayed in delivering or receiving, or is unable to deliver or receive, any quotation of the Bids and Asks of a market in one or more of the instruments in which the Company ordinarily deals in transactions; (ii) an excessive movement in the market of the instrument or the Company\'s reasonable anticipation of the potential occurrence of market disruption.')}</li>
            <li>{it.L('If the Company determines that a force majeure event exists, the Company shall promptly give notice thereof to the client. Subsequently, the Company may, at its absolute discretion, take one or more steps, including but not limited to the following:')}
                <ol>
                    <li>{it.L('Suspend the trading of the affected instrument')}</li>
                    <li>{it.L('Alter the normal trading times for the affected instrument')}</li>
                    <li>{it.L('Close all or any of the client\'s Open Positions at a closing level that is reasonably available')}</li>
                    <li>{it.L('Change the Margin rate in relation to both Open Positions and new Orders')}</li>
                </ol>
            </li>
            <li>{it.L('The Company shall not be in breach of its obligation under this agreement and shall not be held liable for any failure of or delay in performing its obligations under this agreement if such failure or delay is the result of the occurrence of a force majeure event.')}</li>
            <li>{it.L('Nothing in this section on force majeure events shall be taken as indicating that they constitute an Event of Default.')}</li>
            <li>{it.L('This section on force majeure events does not apply to Synthetic Indices.')}</li>
        </ol>

        <h2 data-anchor='representations-and-warranties'>{it.L('N. Representations and warranties')}</h2>
        <ol>
            <li>{it.L('When the client enters into this agreement, they make the following representations and warranties to the Company and agree that such representations and warranties are deemed repeated each time the client opens or closes a transaction:')}
                <ol>
                    <li>{it.L('If the client is an individual, they are over 18 years old and they have full capacity to enter into this agreement.')}</li>
                    <li>{it.L('The client has fully read and understood the (i) Risk disclosure statement, (ii) Order execution policy, and (iii) Terms and conditions attached to this agreement before requesting to open an MT5 Real Account with the Company.')}</li>
                    <li>{it.L('The client has all necessary authority, powers, consents, licences, and authorisations and have taken all necessary actions to enable the client to enter into and perform this agreement and such transactions lawfully.')}</li>
                    <li>{it.L('The execution, delivery, and performance of this agreement and each transaction will not violate any law, ordinance, charter, by-law, or rule applicable to the client or the jurisdiction in which the client is resident.')}</li>
                    <li>{it.L('The client is willing and financially able to sustain a total loss of funds resulting from a transaction, which may exceed the client\'s initial deposit unless they are a retail customer of Deriv Investments (Europe) Limited.')}</li>
                    <li>{it.L('Any information which the client provides or have provided to the Company in respect of their financial position, domicile, or other matters is accurate and not misleading in any material respect.')}</li>
                </ol>
            </li>
            <li>{it.L('The client promises the following:')}
                <ol>
                    <li>{it.L('They will, at all times, obtain, comply with, and do all that is necessary to maintain in full force and effect all authority, powers, consents, licences, and authorities referred to in this clause.')}</li>
                    <li>{it.L('They will take all reasonable steps to comply with any law, ordinance, charter, by-law, or rule applicable to the client or the jurisdiction in which the client is resident.')}</li>
                    <li>{it.L('They will provide the Company with any information that [_1] may reasonably require to fully satisfy the demands or the requirements of the applicable government authority, upon the Company\'s request.', it.website_name)}</li>
                    <li>{it.L('They will use the Margin trading services described in this agreement in good faith and will not use any software, algorithm, or any trading strategy to manipulate or take unfair advantage of the way that the Company\'s Bids and Asks are quoted. The client shall observe the standard of behaviour reasonably expected of persons in the client\'s position and not take any step which would cause [_1] to fail to observe the standard of behaviour reasonably expected of persons in the Company\'s position.', it.website_name)}</li>
                </ol>
            </li>
            <li>{it.L('The client acknowledges that the Company reserves the right to void or close out one or more of the client\'s transactions if the Company observes any breaches of warranty given under this agreement.')}</li>
        </ol>

        <h2 data-anchor='indemnification'>{it.L('O. Indemnification')}</h2>
        <ol>
            <li>{it.L('Neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable for any loss, damage, or debt to the client arising directly or indirectly out of, or in connection with, this agreement. The client agrees to indemnify the Company and its directors, officers, managers, employees, or agents from, and against, any and all liabilities, losses, damages, costs, and expenses (including reasonable attorney\'s fees) incurred arising out of the client\'s failure to comply with any and all of their obligations set forth in this agreement and/or the Company\'s enforcement against the client of any and all of its rights under this agreement.')}</li>
            <li>{it.L('Without prejudice to any other terms of this agreement, neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable to the client in relation to any loss that they have incurred whether directly or indirectly by any cause beyond the Company\'s control, including, but not limited to, any delay or defect in or failure of the whole or any part of the MT5 trading platform or any systems or network links.')}</li>
            <li>{it.L('The Company does not make any warranty, express or implied, that any pricing or other information provided through the MT5 trading platform or otherwise is correct.')}</li>
        </ol>

        <h2 data-anchor='miscellaneous'>{it.L('P. Miscellaneous')}</h2>
        <ol>
            <li>{it.L('The client agrees that in any legal, arbitration, mediation, regulatory, administration, or any other proceedings initiated by them or by [_1], the Company\'s records related to the client\'s dealings shall constitute evidence. Subject to the laws and any court, tribunal, competent authority, or government authority orders, requests, instructions, or guidelines, the client shall not object to the admission of such records on the grounds that they are not originals or in writing, or that they are produced by computers or any other electronic systems whatsoever. The client shall not rely on the Company to meet any of their disclosures or other obligations imposed by any court, tribunal, competent authority, or government authority.', it.website_name)}</li>
            <li>{it.L('If any provision of this agreement shall be held invalid or unenforceable by a court or regulatory body of competent jurisdiction, the remainder of this agreement shall remain in full force and effect.')}</li>
            <li>{it.L('In connection with this agreement and all transactions contemplated by this agreement, the client agrees to execute and deliver such additional documents and instruments and to perform such additional acts as may be necessary or appropriate to effectuate, carry out, and perform all of the terms, provisions, and conditions of this agreement. The client shall cooperate fully with any investigation by any regulatory authority and promptly provide the regulatory authority with such information and records as may be requested in compliance with any law, ordinance, charter, by-law, or rule applicable to the client or the jurisdiction in which they are resident.')}</li>
        </ol>

        <h2 data-anchor='interpretation-of-terms'>{it.L('Q. Interpretation of terms')}</h2>
        <ol>
            <Li
                title={it.L('Account Balance')}
                subtitle={it.L('The client\'s Account Balance represents')}
                sub_list={[
                    it.L('Net of fund transfers between the client\'s [_1] account and their MT5 Real Account', it.website_name),
                    it.L('Net of realised profits credited to the client\'s MT5 Real Account and realised losses debited from their MT5 Real Account'),
                    it.L('Net of any other money credited to the client\'s MT5 Real Account and debited from their MT5 Real Account'),
                ]}
                paragraph={it.L('The client\'s Account Balance includes Margin Requirement. The amount of the client\'s Account Balance in excess of Margin Requirement is available for withdrawal. The amount set aside for Margin Requirement is not available for the client\'s withdrawal.')}
            />
            <Li title={it.L('Account Deposit Currency')} subtitle={it.L('the currency in which the client\'s MT5 Real Account will be operated')} />
            <Li title={it.L('Account Equity')} subtitle={it.L('The client\'s Account Equity refers to the sum of their Account Balance and the net of unrealised profit and loss.')} />
            <Li title={it.L('Account Free Margin')} subtitle={it.L('The client\'s Account Equity minus their Total Margin')} />
            <Li title={it.L('[_1] account', it.website_name)} subtitle={it.L('The client\'s Real Money Account opened with [_1], which the client uses to trade binary options with [_1] trading platform and Binary Webtrader', it.website_name)} />
            <Li title={it.L('Event')} subtitle={it.L('Event examples include circumstances whereby the type of transaction, to which the client\'s Order is related, ceases to be offered, or a Corporate Event, or the insolvency of a company whose shares are related to the subject matter of the Order, and others.')} />
            <Li title={it.L('Leverage')} subtitle={it.L('a ratio which determines the minimum Margin requirement for a trader to open a trade')} />
            <Li title={it.L('Lot')} subtitle={it.L('a transaction unit representing a standardised quantity of the Underlying Instrument, as specified in the Product Disclosure and Specifications. One Lot constitutes the equivalent of 100,000 units of the base currency.')} />
            <Li title={it.L('Limit/Limit Price')} subtitle={it.L('the price specified in the client\'s Limit Order')} />
            <Li title={it.L('Limit Order')} subtitle={it.L('an Order to open or close a transaction if and when a price quote becomes more favourable to the client when compared against the current price')} />
            <Li title={it.L('Margin')} subtitle={it.L('the amount set aside by the Company from the client\'s Account Balance in order to open and maintain a transaction, to cover the client\'s potential loss, if it occurs')} />
            <Li title={it.L('Margin Call')} subtitle={it.L('Margin Call occurs when the Margin Level is less than the Margin Level set for the client\'s account.')} />
            <Li title={it.L('Margin Level')} subtitle={it.L('ratio of Account Equity to Total Margin, expressed as a percentage')} />
            <Li title={it.L('Market Order')} subtitle={it.L('an Order to open or close a position in the market identified by reference to an Underlying Instrument at the current price')} />
            <Li title={it.L('Margin Requirement')} subtitle={it.L('a percentage of the value and contract size of symbols for which there are Open Positions')} />
            <Li title={it.L('Next Available Price')} subtitle={it.L('nearest price reasonably available and quoted by [_1] when the Company Price quotation reaches or goes beyond the level of the client\'s Stop Order', it.website_name)} />
            <Li title={it.L('Open Position')} subtitle={it.L('the position in a market identified by reference to an Underlying Instrument, created by opening a transaction as a result of placing a buy or sell Order to the extent that such a position has not been closed in whole or in part by an opposite Order under this agreement')} />
            <Li title={it.L('Order')} subtitle={it.L('an execution instruction given by the client to the Company to open or close a position in a market identified by reference to the Underlying Instrument, including Market Order, Stop Order, Limit Order, etc.')} />
            <Li title={it.L('Price(s)/Pricing Data')} subtitle={it.L('Bid and Ask Price(s) of each financial instrument in the transaction system, quoted at market price at the moment of pricing')} />
            <Li dataShow='eucountry' title={it.L('Professional Client')} subtitle={it.L('a professional client as defined in the Directive 2004/39/EC of the European Parliament and of the Council (MiFID) or subsequent Directive 2014/65/EU of the European Parliament and of the Council (MiFID II), whichever is in force')} />
            <Li title={it.L('MT5 Real Account')} subtitle={it.L('The client\'s Real Money Account opened with the [_1] MT5 trading platform and licensed by MetaQuotes Software Corporation', it.website_name)} />
            <Li dataShow='eucountry' title={it.L('Retail Client')} subtitle={it.L('a client that is not a Professional client or Eligible Counterparty')} />
            <Li title={it.L('Roll-over')} subtitle={it.L('In the event that the Company does not receive Orders from the client to close an Open Position by the close of a business day, the Company will roll over the said Open Position to the following business day.')} />
            <Li title={it.L('Roll-over Credit/Debit')} subtitle={it.L('Accounts with Open Positions being rolled over shall be credited or debited with an amount referred to as the Roll-over Credit/Debit, which is determined by the Company.')} />
            <Li title={it.L('Settlement')} subtitle={it.L('A Settlement occurs when the client\'s account with the Company is credited or charged with the net amount of the results of a transaction.')} />
            <Li title={it.L('Spread')} subtitle={it.L('the difference between the Bid and Ask Price of a financial instrument')} />
            <Li title={it.L('Stop Order/Stop Loss Order')} subtitle={it.L('an Order to execute a transaction to close an Open Position when the price reaches the client\'s specified price')} />
            <Li title={it.L('Stop Out Level')} subtitle={it.L('the Margin Level at or below which the client\'s Open Positions may be closed forcefully and automatically with or without the client\'s prior consent')} />
            <Li title={it.L('Total Margin')} subtitle={it.L('the aggregate of all Margin Requirements in the client\'s MT5 Real Account')} />
            <Li title={it.L('Underlying Instrument')} subtitle={it.L('the underlying currency, or financial instrument, on which the price of the CFD is based')} />
        </ol>

        <BIEL />
    </div>
);

export default TermsAndConditions;
