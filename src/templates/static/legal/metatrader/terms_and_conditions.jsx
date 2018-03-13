import React from 'react';

const TermsAndConditions = () => (
    <div id='mt-tnc'>
        <h2>{it.L('Terms and Conditions')}</h2>
        <p><i>{it.L('Version 4. Last modified 2016-12-30.')}</i></p>

        <h2>{it.L('A. Introduction and Scope of Agreement')}</h2>
        <ol>
            <li>{it.L('The term \'we\', \'us\', \'our\', \'ours\', \'the Company\', or \'[_1]\' shall denote either Binary (V) Ltd. or Binary (C.R.) S.A., depending on the jurisdiction to which a Client\'s account has been attached in accordance with the account opening procedures of the website.', it.website_name)}</li>
            <li>{it.L('You understand that products based on a random number generator (the "Volatility Indices") are gambling products whereas products based on financial market indices (forex, stocks, commodities) are financial instruments.')}</li>
            <li>{it.L('All products traded on margin carry a high degree of risk and can result in losses as well as profits that exceed your initial deposit. The margin trading services described in this Agreement is not suitable for everyone. You acknowledge that the margin trading services described in this Agreement is designed for clients who are knowledgeable and experienced in the types of transactions described in this Agreement and you fully understand the associated risks before entering into this Agreement with us.')}</li>
            <li>{it.L('You should not sign up to receive the margin trading services described in this Agreement unless you understand their nature and the associated risks.')}</li>
            <li>{it.L('This Agreement is supplied to you in English. In the event that there is a difference between the English version and any translated versions of this document, the English version shall prevail. We will not be made responsible for any damage or loss caused by an error, inaccuracy, misunderstanding or misspelling with regards to the translations.')}</li>
        </ol>

        <h2>{it.L('B. Commencement and Cancellation')}</h2>
        <ol>
            <li>{it.L('This Agreement will commence on the date you receive your Real Account number, and, for any new versions thereafter, on the date the new versions are published on our website.')}</li>
        </ol>

        <h2>{it.L('C. Provision of Services')}</h2>
        <ol>
            <li>{it.L('Under no circumstances shall we provide investment advice or recommendation to you or state an opinion in relation to a Transaction. From time to time, we may decide to provide you with written information, which we may publish on our website or provide to you in any other manner. We will endeavour to ensure the accuracy and completeness of this written information but it will not constitute investment advice or recommendation provided by us to you.')}</li>
            <li>{it.L('The provision of the margin trading services described in this Agreement utilises a third-party system acquired via a non-exclusive, non-transferable, non-sublicensable, terminable licence from the third-party system provider/licensor (the "MT5 Trading Platform"). You acknowledge that we reserve the right to change the third-party system provider/licensor during the course of providing the margin trading services described in this Agreement to you.')}</li>
            <li>{it.L('The provision of the margin trading services described in this Agreement is not available in the European Union.')}</li>
        </ol>

        <h2>{it.L('D. Capacity')}</h2>
        <ol>
            <li>{it.L('[_1] shall act, at times, as a principal and at other times as an agent on your behalf, for all Transactions entered into, by you.', it.website_name)}</li>
            <li>{it.L('We will hold you responsible for all your obligations under this Agreement in our course of providing the margin trading service described in this Agreement to you, even if you notify us that you are acting as the agent of an identified principal.')}</li>
        </ol>

        <h2>{it.L('E. Account Management')}</h2>
        <ol>
            <li>{it.L('Opening an Account')}
                <ol>
                    <li>{it.L('To open a Real Account, you must have an authenticated Binary Options Real Account with [_1]. A Real Account cannot be opened in the absence of a Binary Options Real Account.', it.website_name)}</li>
                    <li>{it.L('Your Binary Options Real Account with [_1] has to be authenticated within five days from your Real Account opening date to keep your Real Account active.', it.website_name)}</li>
                    <li>{it.L('By opening a Real Account with [_1], you represent, warrant and undertake that:', it.website_name)}
                        <ol>
                            <li>{it.L('You are acting for your sole benefit, and not for, or on behalf of any other person;')}</li>
                            <li>{it.L('You have read this Legal Terms and Conditions page in full and understood that you will be buying and selling financial contracts subject to these terms and conditions;')}</li>
                            <li>{it.L('You have read our privacy statement and hereby give us consent to process your personal information as outlined there;')}</li>
                            <li>{it.L('You are over 18 years of age;')}</li>
                            <li>{it.L('You are not resident in a restricted country such as Afghanistan; Bosnia and Herzegovina; Costa Rica; any European Union country; Lao PDR; Syria; Vanuatu; Yemen; USA; Japan; Hong Kong; Malaysia; Malta; Iran; North Korea; Jersey; Iraq; Israel; or any other restricted country as the Company may decide from time to time at its sole discretion;')}</li>
                            <li>{it.L('You have sufficient experience and knowledge in matters of financial trading to be capable of evaluating the merits and risks of acquiring financial contracts via this site and have done so without relying on any information contained in this site.')}</li>
                        </ol>
                    </li>
                    <li>{it.L('We reserve the right to refuse your request to open a Real Account for any reason, and any Real Account may be closed at our discretion at any time.')}</li>
                </ol>
            </li>
            <li>{it.L('Assessment of Appropriateness')}
                <ol>
                    <li>{it.L('In the course of provision of services, we may, where applicable, conduct an appropriateness test, in accordance with our regulatory obligations, in order to determine whether, in our view and on the basis of the information provided by you, you have the necessary knowledge and experience in the investment field to understand the risks involved in the specific type of product or service offered or demanded.')}</li>
                    <li>{it.L('Where we consider, on the basis of the information provided by you that you do not possess the knowledge and experience to appreciate the risks associated with an investment in the proposed instrument, we will issue a warning to you. Such a warning shall be displayed on the website.')}</li>
                    <li>{it.L('In accordance with applicable regulatory requirements, where we do not manage to obtain sufficient information to assess the appropriateness of the product or service for you, we will similarly inform you that we are not in a position to assess appropriateness.')}</li>
                </ol>
            </li>
            <li>{it.L('Fund Transfers')}
                <ol>
                    <li>{it.L('Funding of Real Account')}
                        <ol>
                            <li>{it.L('Your Real Account shall be funded by transferring funds from your Binary Options Real Account, subject to the availability and sufficiency of funds in your Binary Options Real Account. No fund transfers shall be made to any other account in the name of any third party.')}</li>
                            <li>{it.L('All fund transfers from your Binary Options Real Account to your Real Account must be made by you.')}</li>
                            <li>{it.L('You acknowledge and accept that your Real Account will be maintained in one currency, which is the same currency maintained in your Binary Options Real Account.')}</li>
                            <li>{it.L('There will be no charges for fund transfers from your Binary Options Real Account to your Real Account.')}</li>
                        </ol>
                    </li>
                    <li>{it.L('Withdrawal of Funds from Real Account')}
                        <ol>
                            <li>{it.L('Subject to the availability and sufficiency of funds in your Real Account, you may withdraw your funds from your Real Account to your Binary Options Real Account.')}</li>
                            <li>{it.L('We may, however, withhold your withdrawal request from your Real Account to your Binary Options Real Account, in whole or in part, if:')}
                                <ol>
                                    <li>{it.L('You have unrealised losses on your Real Account; and/or')}</li>
                                    <li>{it.L('Such withdrawal would result in your Account Equity being less than zero; and/or')}</li>
                                    <li>{it.L('We reasonably consider that funds may be required to meet any Margin Requirement; and/or')}</li>
                                    <li>{it.L('There is any amount outstanding from you to us; and/or')}</li>
                                    <li>{it.L('We are required to do so in accordance with any relevant law or regulation.')}</li>
                                </ol>
                            </li>
                            <li>{it.L('Withdrawal of funds from your Real Account must be made in the same currency maintained in your Binary Options Real Account.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('Accounts with debit balance (i.e. credit exposure to [_1])', it.website_name)}
                <ol>
                    <li>{it.L('The Company does not offer any credit facilities or arrangement to its clients in normal trading circumstances. You acknowledge and agree that you will not be dealing with us on credit, regardless of the amount of your Account Balance and Transactions entered into with us.')}</li>
                    <li>{it.L('Accounts with debit balances are required to settle the full amount immediately by making a payment to us.')}</li>
                    <li>{it.L('If you fail to immediately make a full settlement of the sum due to us in accordance with this Agreement, we reserve the right to accrue interest on the sums due from you to us in respect of any Transaction that you fail to pay on the relevant due date. Interest will accrue on a daily basis from the relevant due date until the date on which payment is received in full at the bank\'s official base rate for short term funds determined by us, and will be payable on demand.')}</li>
                </ol>
            </li>
            <li>{it.L('Inactive/Dormant Accounts')}
                <ol>
                    <li>{it.L('We reserve the right to charge a dormant fee of up to USD/EUR/AUD/GBP25 every six months for every client account that has had no transaction recorded for a period of 12 consecutive months or more.')}</li>
                </ol>
            </li>
            <li>{it.L('Account Security')}
                <ol>
                    <li>{it.L('We are committed to making sure your personal data and transactions are secure:')}
                        <ol>
                            <li>{it.L('Your Real Account password and login ID are unique and passwords are hashed so that not even [_1] staff can read them. This is the reason why we cannot retrieve your password and have to issue you with a new one to your email address if you cannot recall it;', it.website_name)}</li>
                            <li>{it.L('It is your responsibility to keep your password and login ID confidential. You agree that you will not disclose your password and login ID to any other person;')}</li>
                            <li>{it.L('All credit card details are submitted directly to the Visa/Mastercard network using the latest SSL encryption technology, in accordance with bank policies;')}</li>
                            <li>{it.L('Our information security policies are based on industry best practices in access control and business continuity; and')}</li>
                            <li>{it.L('We use identity verification services and real-time fraud detection measures to help protect you from unauthorised access to your account. We also monitor account activity for signs of unusual activity that might indicate fraud and work with collection agencies and low-enforcement agencies to address fraud issues.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('Closing an Account')}
                <ol>
                    <li>{it.L('If you wish to withdraw funds from your Real Account and close your Real Account, you may notify us by contacting our helpdesk at <a href=\'mailto:[_1]\'>[_1]</a>. Your Real Account may be closed if you do not have any Open Positions and all amounts due to us have been settled.', 'support@binary.com')}</li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('F. Orders')}</h2>
        <ol>
            <li>{it.L('Order Execution/Cancellation/Modification')}
                <ol>
                    <li>{it.L('You acknowledge that it is your responsibility to understand the features, characteristics, terms and conditions of an Order and the implications of executing an Order before you place an Order with us.')}</li>
                    <li>{it.L('Subject to network latency, we endeavour to execute your Order within a reasonable time from the time you triggered the Order, at the Price nearest to your specified Price. We do not guarantee that a Transaction will be opened/closed following an Order being triggered by you at your specified Price.')}</li>
                    <li>{it.L('We endeavour to open or close the Transaction to which your Order relates at the price reasonably available to us, acting in accordance with our duty of best execution. Best execution means that we must take all sufficient steps to obtain, when executing orders, the best possible result for you, taking into account the price, costs, speed, likelihood of execution and settlement, size, nature, or any other consideration relevant to the execution of the order.')}</li>
                    <li>{it.L('Our Prices are determined by reference to the price of the underlying instrument which is quoted on external exchanges or dealing facilities that we select at our discretion. Our IT infrastructure and price aggregator system facilitates the reception of quotes from shortlisted prime brokers who act as liquidity providers for us and the delivery of the quotes, derived with reference against relevant benchmark and markets, to you. You acknowledge that our Prices may differ from the bid and offer prices made available by external exchanges or dealing facilities and we are not liable for any losses that you incur arising from such differences. This clause does not apply to Volatility Indices.')}</li>
                </ol>
            </li>
            <li>{it.L('Stop and Limit Orders')}
                <ol>
                    <li>{it.L('We may, at our absolute discretion, accept a Stop Order or a Limit Order from you. We may enable other types of Orders (for example, a trailing stop order) for your execution at any point in time.')}</li>
                    <li>{it.L('You may specify your instruction of a Stop Order or a Limit Order may be applied for a limited duration or for an indefinite period (a "good till cancelled" or "GTC" Order).')}</li>
                    <li>{it.L('In the case of a Stop Order, you acknowledge that we will endeavour to open/close a Transaction at the Next Available Price.')}</li>
                    <li>{it.L('In the case of a Limit Order, you acknowledge that we will endeavour to open/close a Transaction at a level that is the same or better than the Limit you specified, subject to the availability of the Limit Price. You acknowledge that at the time of order execution, our bid/offer price may become less favourable to you.')}</li>
                    <li>{it.L('You may not cancel or amend the level of your Stop and Limit Order prior to the closing of your Transaction once the level has been reached.')}</li>
                    <li>{it.L('You acknowledge that a Stop or Limit Order placed on your Open Position, when executed, would be capable of closing or partly closing your Transaction. You also acknowledge that it is your responsibility to cancel the Stop or Limit Order that you placed on your Open Positions if you do not want the Stop or Limit Order to remain valid. If you close your original Transaction and fail to cancel the Stop or Limit Order, we shall be entitled, at our absolute discretion, to treat the Stop or Limit Order as an instruction to enter into a new Transaction for you if and when our quote reaches or goes beyond the level of the Stop or Limit Order.')}</li>
                    <li>{it.L('You acknowledge that we reserve the right to establish a minimum and maximum transaction size which may be subject to alteration and that we will only execute Orders that fall within the range of the minimum and maximum transaction size.')}</li>
                    <li>{it.L('We may, at our absolute discretion, disregard your Order if an Event takes place resulting in it no longer being reasonable for us to act on your Order after indicating an acceptance of your Order.')}</li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('G. Margin')}</h2>
        <ol>
            <li>{it.L('General Provisions')}
                <ol>
                    <li>{it.L('Prior to placing an Order which results in opening a Transaction or increasing an existing Open Position, you acknowledge that it is your responsibility to ensure that your Account\'s Free Margin is sufficient to cover the Margin required in relation to the open Transaction (the "Margin Requirement"), and to continuously meet the Margin Requirement.')}</li>
                    <li>{it.L('Throughout the duration of the Transaction and for as long as the Transaction is open, you are required to maintain a sufficient Account Equity to cover any Margin Requirement. If your Account Equity is less than the Margin Requirement in relation to the open Transaction you wish to create, you have entered into a Margin Call and you are required to fund the shortfall immediately. You may not be able to place an Order to open a Transaction until the shortfall has been funded and there is sufficient Account Equity to cover the Total Margin.')}</li>
                    <li>{it.L('You acknowledge that it is your responsibility to monitor your Account Balance and Margin Requirement and we are not under any obligation to keep you informed (i.e., to make a Margin Call).')}</li>
                </ol>
            </li>
            <li>{it.L('Margin Requirement and Calculation')}
                <ol>
                    <li>{it.L('The Margin Requirement is a percentage of the value of the Open Positions and will continue to fluctuate in accordance with the value of the Open Positions throughout the duration of the relevant contracts (the "Contract Value").')}</li>
                    <li>{it.L('Margin Requirements can increase/decrease based on the aggregated size of your Open Position determined by the volume (number of lots), contract size (value per point in the original currency of the contract), market price, and margin rate.')}</li>
                    <li>{it.L('We may modify Margin Requirements for any Open Positions or new Transactions entered into, at our sole discretion. Formulas for Margin Requirements published on the website are indicative only and may be changed by the Company at its discretion at any time, due to changing market conditions or other factors.')}</li>
                    <li>{it.L('Whilst we endeavour to close out your Open Positions if and when the Margin Level for your Real Account reaches or falls below the Stop Out Level, we do not guarantee that your Open Positions will be closed when the Margin Level for your Real Account reaches the Stop Out Level.')}</li>
                    <li>{it.L('For perfectly hedged positions, no margin will be charged. However, swaps and other applicable fees can cause your Account Equity to turn negative. In such cases, the company reserves the right to close out your hedged positions in order to protect your Account Equity from decreasing further.')}</li>
                </ol>
            </li>
            <li>{it.L('Stop Out Level')}
                <ol>
                    <li>{it.L('If the Margin Level for your Real Account reaches or falls below the Stop Out Level, this will be classified as an Event of Default. In such circumstances, Open Positions are automatically closed in the following order: (i) the server analyses clients\' Orders that are not under execution at the moment; (ii) the server deletes Orders with the largest Margin; (iii) if your Margin Level is still under the Stop Out Level, the next order is deleted (orders without margin requirements are not deleted); (iv) if your Margin Level is still under the Stop Out Level, the server closes a position with the largest loss; (v) Open Positions are closed until your Margin Level becomes higher than the Stop Out Level.')}</li>
                    <li>{it.L('The default Stop Out Level applicable to your Account is published on our website. However, the default Stop Out Level is subject to alteration at our absolute discretion. Any changes to the Stop Out Level will take effect immediately. We will endeavour to notify you of an alteration to the default Stop Out Level by publishing the revised default Stop Out Level on our website. It is your responsibility to check our website regularly and remain informed about the default Stop Out Level.')}</li>
                    <li>{it.L('The Stop Out Level applicable to your Real Account may differ from the default Stop Out Level published on our website.')}</li>
                </ol>
            </li>
            <li>{it.L('Margin Payment')}
                <ol>
                    <li>{it.L('You may make Margin Payments by transferring funds from your Binary Options Real Account to your Real Account. In the event that there are insufficient funds in your Binary Options Real Account to fund your Real Account, you may make Margin Payments by funding your Binary Options Real Account and transferring the funds from your Binary Options Real Account to your Real Account.')}</li>
                    <li>{it.L('Margin Payments are due immediately and shall be received in full by us.')}</li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('H. Regulatory Provisions')}</h2>
        <ol>
            <li>{it.L('Potential Conflicts of Interest')}
                <ol>
                    <li>{it.L('The margin trading services described in this Agreement are conducted over the counter. This means that the market in one or more of the instruments which you ordinarily transact with us, though quoted on an exchange, are not traded on an exchange when transacted through the electronic trading platform as described in this Agreement.')}</li>
                    <li>{it.L('You acknowledge that the Company will determine, at its discretion, the Transactions that will be kept in the Company\'s own book (known as B booking) and the Transactions that will be passed through to the prime brokers who act as liquidity providers for the Company (known as A booking). For the latter, the Company is the counterparty in these transactions and a correlation between the profit/loss made by the client and the profit/loss made by the Company exists. At any point in time, we may be entering into or may have entered into transactions with a large number of clients, each of whose interests may diverge from those of other clients. As such, the Company may be holding Open Positions that may not be aligned with your objectives/interests as an individual client of the Company.')}</li>
                    <li>{it.L('Whilst we endeavour to take all reasonable and sufficient steps, as required by applicable laws and regulations, to identify potential conflicts of interests between ourselves and our clients, or between one client and another, that arise in the course of providing the margin trading services as described in this Agreement, by establishing and implementing policies and procedures, it is possible that we may execute certain Transactions which may have other direct or indirect material interests.')}</li>
                    <li>{it.L('Given our role as a margin trading service provider as described in this Agreement, we seek to avoid undue market influence to the extent consistent with your trading needs and our risk management policies and procedures. By continuing to use the margin trading services described in this Agreement, you acknowledge that you are aware of the potential conflict of interest disclosed that may arise and cannot be completely eliminated, and you consent us to act notwithstanding such potential conflict of interests.')}</li>
                </ol>
            </li>
            <li>{it.L('Client Money')}
                <ol>
                    <li>{it.L('Money collected from Clients are not invested in any securities, futures, or other investments, on behalf of Clients.')}</li>
                    <li>{it.L('The company holds customer funds in separate bank accounts to the operational accounts; and arrangements have been made to ensure assets in the customer accounts are distributed to customers in the event of insolvency.')}</li>
                    <li>{it.L('Your account should not be used as a banking facility and deposits should only be made with a view to using funds to place contracts. The Company is not a financial institution. Clients will not receive interest on deposits. Should you make repeated deposits and withdrawals without commensurate contracts being placed, we reserve the right to pass on to your accounts, without prior notice, any bank charges we have incurred before closing the account.')}</li>
                </ol>
            </li>
            <li>{it.L('Personal Data and Privacy')}
                <ol>
                    <li>{it.L('You acknowledge that we may use, store, or otherwise process personal information provided by you in connection with the provision of margin trading services described in this Agreement. You consent to the processing and transmittal of your personal information for the purposes of performing the contract and administering the relationship between you and us.')}</li>
                    <li>{it.L('You consent to us recording any telephone conversation between you and us. All instructions receive by telephone will be binding as if received in writing. Recorded telephone conversations between you and us shall be, and remain, our sole property. You will accept recorded telephone conversations between you and us as conclusive evidence of instructions or conversations so recorded and we may deliver copies of transcripts of such recordings to any court, regulatory, or governmental authority without seeking prior consent from you.')}</li>
                    <li>{it.L('We may or may not use your personal information to contact you at any reasonable time as part of our marketing activities. You authorise us to contact you by email or telephone to give you information about selected products and services offered by us. Your consent for us to use your personal information for this purpose applies to the period you have a Real Account with us and after you close your Real Account. Please advise us in writing if you do not wish your personal information to be used for such purposes.')}</li>
                </ol>
            </li>
            <li>{it.L('Confidentiality')}
                <ol>
                    <li>{it.L('The personal information that we collect and hold is treated as confidential. Confidential information will not be used for any purpose other than in connection with the provision of the margin trading services described in this Agreement. Confidential information will only be disclosed as and when required by law. We may also disclose such personal information to: (i) other companies within the Binary Group of companies; (ii) any such third parties as we see fit to assist us in servicing your Real Account; (iii) regulatory authorities upon their reasonable request; (iv) any such third parties as we see fit to assist us in enforcing our legal or contractual rights against you, including, but not limited, to legal advisors; (v) third parties as we see fit to investigate or prevent fraud or other illegal activities.')}</li>
                </ol>
            </li>
            <li>{it.L('Complaints and disputes')}
                <ol>
                    <li>{it.L('If you would like to file a complaint with regards to the margin trading services described in this Agreement, kindly contact us by providing the relevant details related to your complaint. We shall investigate your enquiry and a response will be given to your enquiry. We will usually provide a final response within one to two weeks (and at most within two months) from the receipt of all relevant details.')}</li>
                    <li>{it.L('If your complaint relates to an outcome of a Transaction and remains unresolved, it will turn into a dispute. Should you be unsatisfied with our response, you can choose to escalate your complaint to an alternative dispute resolution entity.')}</li>
                    <li>{it.L('Clients registered with any Binary Group company, and in particular with Binary (V) Ltd. or Binary (C.R.). S.A., can raise their unresolved disputes with management by submitting an email to <a href=\'mailto:[_1]\'>[_1]</a>.', 'complaints@binary.com')}</li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('I. Quotes')}</h2>
        <ol>
            <li>{it.L('Quote Provision')}
                <ol>
                    <li>{it.L('A higher figure (higher to you) representing our offer price and a lower figure (lower to you) representing our bid price for each Transaction shall be quoted to you upon your request. The difference between our bid and our offer price will comprise of the market spread (where there is market for the underlying instrument) and our spread (being our charge to you).')}</li>
                    <li>{it.L('The minimum spread (which is comprised of the market spread and our spread) published on our website is subject to alteration, at our absolute discretion. You acknowledge that whilst we endeavour to maintain a competitive spread, both market spread and our spread may widen significantly in some circumstances and such figures will be determined by us at our reasonable discretion.')}</li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('J. Trading Transactions')}</h2>
        <ol>
            <li>{it.L('Opening a Transaction')}
                <ol>
                    <li>{it.L('A Transaction is opened by either executing a "Buy" or "Sell" Order based on a specified number of lots (volume) that constitute the underlying instrument of the relevant market.')}</li>
                    <li>{it.L('Any Transaction opened by you must be within any credit or position limit in effect with respect to the Real Account or any Transactions.')}</li>
                    <li>{it.L('Upon opening a Transaction, the sum due and payable by you to us are deducted from your Account Balance.')}</li>
                </ol>
            </li>
            <li>{it.L('Closing a Transaction')}
                <ol>
                    <li>{it.L('General Provisions')}
                        <ol>
                            <li>{it.L('An Open Position may be closed by placing an opposite Order, that is an Order to sell (to close a Long Position) or to buy (to close a Short Position) in the same market for the same specified number of lots (volume).')}</li>
                            <li>{it.L('An Open Position may be partially closed by entering into an opposite Transaction in the same Market but for a smaller number of lots (volume) as the Open Position.')}</li>
                            <li>{it.L('If a closing Transaction in the same market is entered into but with a higher number of lots, the original Open Position will be closed and a new Open Position will be entered into for the number of lots by which the new Transaction exceeds the Open Position.')}</li>
                            <li>{it.L('If you have entered into more than one Open Position in the same market, any closing Transaction that you place in the same market will close the Open Positions in the chronological order in which the Open Positions were first created on a first in first out basis.')}</li>
                            <li>{it.L('Upon closing a Transaction, the realised profit (or loss), which is represented by the difference between the opening level and closing level of the Transaction multiplied by the number of lots (volume), becomes due and payable by us to you (or due and payable by you to us in cases of realised loss).')}</li>
                        </ol>
                    </li>
                    <li>{it.L('Trading Rules')}
                        <ol>
                            <li>{it.L('You acknowledge and accept that a Transaction may be subject to market rules laid down in by-laws, rules, provisions, customs, and practices of an exchange, a market, a clearing house, a body or any other organisation involved in the execution, clearing, and/or settlement of said Transaction. Should any such organisation take decisions or measures which affect a Transaction or an Open Position, the Company shall be entitled to take any action (including closing any Open Position of the client) which it, at its sole discretion, considers reasonable. This clause does not apply to Volatility Indices.')}</li>
                            <li>{it.L('You acknowledge and agree that the Company may, at any time without prior notice and at its discretion, change the trading rules in relation to:')}
                                <ol>
                                    <li>{it.L('The hours of closure of the market (for e.g., the hours over the weekend during which trading of certain transactions are not possible);')}</li>
                                    <li>{it.L('The minimum, incremental and maximum transaction amount;')}</li>
                                    <li>{it.L('The instruments available on the electronic trading platform (including their availability for trading);')}</li>
                                    <li>{it.L('The cut-off time for performing Roll-overs and booking of the Roll-over Credit/Debit.')}</li>
                                </ol>
                            </li>
                            <li>{it.L('This clause does not apply to Volatility Indices.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
        </ol>

        <h2>{it.L('K. Electronic Trading Platform and Transactions')}</h2>
        <ol>
            <li>{it.L('All intellectual property rights in the MT5 Trading Platform are owned by the Licensor and shall remain the exclusive property of the Licensor. Nothing in this Agreement intends to transfer any such rights or to vest any such rights in you.')}</li>
            <li>{it.L('Your use of the MT5 Trading Platform, whether accessed through or downloaded from our website or a third-party website, is governed by the terms of use provided by the MT5 Trading Platform Licensor to you. In the event of any conflict between the content of this Agreement and the agreement between you and the MT5 Trading Platform Licensor, the terms of this Agreement shall prevail. It is your responsibility to ensure that the information technology that you use is compatible with the required information technology to support the MT5 Trading Platform.')}</li>
            <li>{it.L('You acknowledge, understand, represent and warrant that you are aware of the functional limitations of the MT5 Trading Platform (for example, Wine, which is not a fully stable application, as disclosed by the MT5 Trading Platform Licensor on their website). We have no obligation and bear no responsibility for transmissions (including, but not limited to, Orders) that are inaccurate or not received by us, due to the functional limitations of the MT5 Trading Platform.')}</li>
            <li>{it.L('We will act on any instructions given, or appearing to be given by you and received by us in relation to the margin trading services provided through the MT5 Trading Platform, as deemed instructed by you. However, it is not our obligation to act on any instructions deemed instructed by you, and we are not obligated to give you any reasons for declining to do so. Instructions received by us from you are deemed final and will not be revocable. It is your responsibility to ensure the genuineness and accuracy of the instructions given by you to us.')}</li>
            <li>{it.L('We will use reasonable endeavours within our control to ensure that all electronic data provided on the MT5 Trading Platform and all electronic transactions instructed and accepted from you to us, and executed by us are not subject to network latency.')}</li>
            <li>{it.L('You hereby agree that you will not participate in any illegal, deceptive, misleading or unethical practices including, but not limited to, disparagement of the MT5 Trading Platform or other practices which may be detrimental to the MT5 Trading Platform, Licensor or the public interest.')}</li>
            <li>{it.L('The Company sources market data from prime brokers who act as liquidity providers, thus executing your Transactions through a pool of aggregated liquidity from top tier banks. The services offered by the Company do not include physical delivery of foreign currency by us or the prime brokers to yourselves. You acknowledge and agree that such data is proprietary to us and any such provider, and you will not retransmit, redistribute, publish, disclose, or display in whole or in part such data to third parties. You represent and warrant that you will only use such data for purposes of facilitating your entry into Transactions with us on your Real Account in accordance with this Agreement and not for any other purpose. This clause does not apply to Volatility Indices.')}</li>
        </ol>

        <h2>{it.L('L. Event of Default')}</h2>
        <ol>
            <li>{it.L('Each of the following event constitutes an "Event of Default":')}
                <ol>
                    <li>{it.L('Your death, your incapacity, become of unsound mind or your inability to pay your debts as they fall due, or is bankrupt or insolvent, as defined under any bankruptcy or insolvency law applicable to you, if you are an individual;')}</li>
                    <li>{it.L('The Margin Level of your Real Account reaches or falls below the Stop Out Level;')}</li>
                    <li>{it.L('You act in breach of any warranty or representation made under this Agreement, and/or if any information provided to us in connection with this Agreement is, or becomes, untrue or misleading;')}</li>
                    <li>{it.L('Your debts are not settled as, and when, they fall due;')}</li>
                </ol>
            </li>
            <li>{it.L('Rights on Default:')}
                <ol>
                    <li>{it.L('On the occurrence of an Event of Default, we may exercise our rights under this clause, at any time and without prior notice:')}
                        <ol>
                            <li>{it.L('Closing or part-closing all, or any, of your Open Positions based on the prevailing prices available in the relevant markets;')}</li>
                            <li>{it.L('Suspending your Real Account and refusing to execute any Orders to enter into further Transactions with you. Whilst your Real Account is suspended, you will be able to place Orders to close your Open Positions, but you will not be able to place Orders which would create Open Positions.')}</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>{it.L('In the event of your failing to make a Margin Payment, we may, at our absolute discretion, allow your Open Positions to remain open and allow you to place new Orders to open a Transaction. You acknowledge that, upon allowing your Open Positions to remain open, you may incur further losses.')}</li>
        </ol>

        <h2>{it.L('M. Manifest Error')}</h2>
        <ol>
            <li>{it.L('We reserve the right to void or amend the contractual terms of any Transactions that we reasonably believe are entered into at prices that do not reflect fair market prices or that are entered into at an abnormally low level of risk due to an obvious or palpable error (a “Manifest Error”). In deciding whether an error is a Manifest Error, we may take into account any relevant information, including the state of the underlying market at the time of the error and any error within, or lack of clarity of, any information source or pronouncement. You have a duty to report to us any such problems, errors, or suspected system inadequacies that you may experience and may not abuse or arbitrage such system problems or errors for profit. We will endeavour to resolve any such difficulties in the shortest time possible.')}</li>
            <li>{it.L('Any amendments to the contractual terms of Manifestly Erroneous contracts shall be reasonable and fair. Monies exchanged between you and us in connection with the Manifestly Erroneous contracts shall be returned to the recipient according to the amendments made to the contractual terms and conditions of this Agreement.')}</li>
            <li>{it.L('You further acknowledge and agree that we will not be held liable or responsible, whether directly or indirectly, for any loss, expenses or damage caused, or alleged to be caused by, or in connection with a Manifest Error.')}</li>
        </ol>

        <h2>{it.L('N. Force Majeure Events')}</h2>
        <ol>
            <li>{it.L('A force majeure event, if and when determined, means, (i) the Company, by reason of force majeure or act of state, is prevented from, or hindered or delayed, in delivering or receiving, or is impossible to deliver or receive, any quotation of the bid and offer price of a market in one or more of the instruments which we ordinarily deal in Transactions; (ii) an excessive movement in the market of the instrument or our reasonable anticipation of the potential occurrence of market disruption.')}</li>
            <li>{it.L('If we determine that a force majeure event exists, the Company shall promptly give notice thereof to the client. Subsequently, we may, at our absolute discretion, take one or more of the following steps:')}
                <ol>
                    <li>{it.L('Suspend the trading of the affected instrument;')}</li>
                    <li>{it.L('Alter the normal trading times for the affected market;')}</li>
                    <li>{it.L('Close all or any of your Open Positions at a closing level that is reasonably available;')}</li>
                    <li>{it.L('Change the margin rate in relation to both Open Positions and new orders;')}</li>
                    <li>{it.L('Change the Stop Out Level in relation to your account.')}</li>
                </ol>
            </li>
            <li>{it.L('The Company shall not be in breach of its obligation under this Agreement and shall not be held liable for any failure of or delay in performing its obligations under this Agreement if such failure or delay is the result of the occurrence of a Force Majeure Event.')}</li>
            <li>{it.L('Nothing in this Force Majeure Event section shall be taken as indicating that it constitutes an event of default.')}</li>
            <li>{it.L('This section on Force Majeure Events does not apply to Volatility Indices.')}</li>
        </ol>

        <h2>{it.L('O. Representations and Warranties')}</h2>
        <ol>
            <li>{it.L('You make the following representations and warranties to us at the time you enter into this Agreement, and agree that such representations and warranties are deemed repeated each time you open or close a Transaction:')}
                <ol>
                    <li>{it.L('If you are an individual, you are over 18 years old and you have full capacity to enter into this Agreement;')}</li>
                    <li>{it.L('You have fully read and understood the: (i) Risk Disclosure Statement; (ii) Order Execution Policy; (iii) terms and condition attached to this Agreement; before requesting to open a Real Account with us;')}</li>
                    <li>{it.L('You have all necessary authority, powers, consents, licences and authorisations and have taken all necessary actions to enable you to enter into, and perform this Agreement and such Transactions lawfully;')}</li>
                    <li>{it.L('The execution, delivery, and performance of this Agreement and each Transaction will not violate any law, ordinance, charter, by-law, or rule applicable to you or the jurisdiction in which you are resident.')}</li>
                    <li>{it.L('You are willing and financially able to sustain a total loss of funds (which may exceed your initial deposit) resulting from a Transaction;')}</li>
                    <li>{it.L('Any information which you provide or have provided to us in respect of your financial position, domicile or other matters is accurate and not misleading in any material respect.')}</li>
                </ol>
            </li>
            <li>{it.L('You promise that:')}
                <ol>
                    <li>{it.L('You will, at all times, obtain and comply, and do all that is necessary to maintain in full force and effect, all authority, powers, consents, licences, and authorities referred to in this clause;')}</li>
                    <li>{it.L('You will take all reasonable steps to comply with any law, ordinance, charter, by-law, or rule applicable to you or the jurisdiction in which you are resident;')}</li>
                    <li>{it.L('You will provide us with any information that we may reasonably require to fully satisfy the demand or the requirements of the applicable government authority, upon our request.')}</li>
                    <li>{it.L('You will use the margin trading services described in this Agreement in good faith and you will not use any software, algorithm, or any trading strategy to manipulate or take unfair advantage of the way our bid and offer prices are quoted. You shall observe the standard of behaviour reasonably expected of persons in your position and not take any step which would cause us to fail to observe the standard of behaviour reasonably expected of persons in our position.')}</li>
                </ol>
            </li>
            <li>{it.L('You acknowledge that we reserve the right to void or close out one or more of your Transactions if we observe any breaches of warranty given under this Agreement.')}</li>
        </ol>

        <h2>{it.L('P. Indemnification')}</h2>
        <ol>
            <li>{it.L('Neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable for any loss, damage or debt to you arising directly or indirectly out of, or in connection with this Agreement. You agree to indemnify the Company and its directors, officers, managers, employees, or agents from, and against, any and all liabilities, losses, damages, costs, and expenses (including reasonable attorney\'s fees) incurred arising out of your failure to comply with any and all of your obligations set forth in this Agreement and/or the Company\'s enforcement against you of any and all of its rights under this Agreement.')}</li>
            <li>{it.L('Without prejudice to any other terms of this Agreement, neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable to you in relation to any loss that you incurred whether directly or indirectly by any cause beyond our control, including, but not limited to, any delay or defect in or failure of the whole or any part of the MT5 Trading Platform or any systems or network links.')}</li>
            <li>{it.L('The Company does not make any warranty, express or implied, that any pricing or other information provided through the MT5 Trading Platform or otherwise is correct. Furthermore, if a quote (bid or offer price) error occurs due to a system malfunction (whether or not it\'s a third party or a proprietary system), the Company will not be liable for any resulting losses that have incurred.')}</li>
        </ol>

        <h2>{it.L('Q. Miscellaneous')}</h2>
        <ol>
            <li>{it.L('Unless proven to be wrong, our records shall be used as evidence of your dealings with us in connection with the margin trading services described in this Agreement. You agree to use our records as evidence in any such legal or regulatory proceedings and you agree to keep your own record of your dealings with us that will help us investigate any complaints or disputes. If the records used as evidence of your dealings with us are not originals, are in the form of diagrams or charts, or are system generated content, you will not object to the use of such records as evidence.')}</li>
            <li>{it.L('The [_1] website is protected by certain copyrights. The materials comprising the website (including without limitation all articles, text, images, logos, compilation, systems, code and design) are Copyright 1999-2017 Binary Group of companies. All rights reserved. Such materials may be copied and distributed on a limited basis for noncommercial purposes only, provided that any material copied remain intact and that all copies include the following notice in a clearly visible position: "Copyright 1999-2017 Binary Ltd. All rights reserved." These materials may not be copied or redistributed for commercial purposes or for compensation of any kind without prior written permission from a member of the Binary Group. [_1] and the bull/bear logo are registered trademarks.', it.website_name)}</li>
            <li>{it.L('If any provision of this Agreement shall be held invalid or unenforceable by a court or regulatory body of competent jurisdiction, the remainder of this Agreement shall remain in full force and effect.')}</li>
            <li>{it.L('In connection with this Agreement and all Transactions contemplated by this Agreement, you agree to execute and deliver such additional documents and instruments, and to perform such additional acts as may be necessary or appropriate to effectuate, carry out, and perform all of the terms, provisions, and conditions of this Agreement. You shall cooperate fully with any investigation by any regulatory authority and promptly provide the regulatory authority with such information and records as may be requested in compliance with any law, ordinance, charter, by-law, or rule applicable to you or the jurisdiction in which you are resident.')}</li>
        </ol>

        <h2>{it.L('R. Interpretation of Terms')}</h2>
        <ol>
            <li>{it.L('Account Balance &mdash; Your account balance represents:')}
                <ol>
                    <li>{it.L('net of fund transfers between your Binary Options Account and your Real Account;')}</li>
                    <li>{it.L('net of realised profits credited to your Real Account and realised losses debited from your Real Account;')}</li>
                    <li>{it.L('net of any other money credited to your Real Account and debited from your Real Account. Your account balance includes Margin Requirement. The amount of your account balance in excess of Margin Requirement is available for your withdrawal. The amount set aside for Margin Requirement is not available for your withdrawal.')}</li>
                </ol>
            </li>
            <li>{it.L('Account Equity &mdash; Your Account Equity refers to the sum of your Account Balance and the net of unrealised profit and loss.')}</li>
            <li>{it.L('Account Free Margin &mdash; Your Account Equity minus your Total Margin.')}</li>
            <li>{it.L('Binary Options Real Account &mdash; Your real money account opened with [_1] which you use to trade binary options with [_1].', it.website_name)}</li>
            <li>{it.L('Event &mdash; Event examples include circumstances whereby the type of Transaction to which your Order is related to ceased to be offered, or a Corporate Event or the insolvency of a Company whose shares represent are related to the subject matter of the Order, and others.')}</li>
            <li>{it.L('Limit/Limit Price &mdash; The price specified in your Limit Order.')}</li>
            <li>{it.L('Limit Order &mdash; An instruction to open or close a transaction if and when a price quote becomes more favourable to you when compared against the current price.')}</li>
            <li>{it.L('Margin &mdash; The amount set aside by us from your Account Balance in order to open and maintain a Transaction, to cover our exposure as a counterparty to your contract.')}</li>
            <li>{it.L('Margin Level &mdash; Ratio of Account Equity to Total Margin, expressed as a percentage.')}</li>
            <li>{it.L('Next Available Price &mdash; Earliest price reasonably available and quoted by [_1] when our Price quotation reaches or goes beyond the level of your Stop Order.', it.website_name)}</li>
            <li>{it.L('Open Position &mdash; The position in a market made by reference to an Underlying Instrument created by opening a Transaction as a result of placing an Order to the extent that such position has not been closed in whole or in part under this Agreement.')}</li>
            <li>{it.L('Order &mdash; An execution instruction given by you to us in relation to a Market Order, Stop Order, Limit Order, and etc.')}</li>
            <li>{it.L('Price/Prices &mdash; Bid and Offer Price/Prices.')}</li>
            <li>{it.L('Real Account &mdash; Your real money account opened with [_1]\'s MT5 Trading Platform licensed from MetaQuotes Software Corporation.', it.website_name)}</li>
            <li>{it.L('Roll-over &mdash; In the event that the Company does not receive Orders from you to close an Open Position by the close of a Business Day, the Company will roll-over the said Open Position to the following day being a Business Day.')}</li>
            <li>{it.L('Roll-over Credit/Debit &mdash; Accounts with Open Positions concerned by the Roll-over shall be credited or debited with an amount referred to as the Roll-over Credit/Debit which is determined by the Company at its sole discretion.')}</li>
            <li>{it.L('Stop Order/Stop Loss Order &mdash; An instruction to execute a Transaction to close an Open Position when the Price reaches your specified Price.')}</li>
            <li>{it.L('Stop Out Level &mdash; The Margin Level at, or below, which your Open Positions may be forcefully closed with or without your prior consent.')}</li>
            <li>{it.L('Total Margin &mdash; The aggregate of all Margin Requirements in your Real Account.')}</li>
            <li>{it.L('Transaction &mdash; A contract entered into by you pursuant to this Agreement.')}</li>
        </ol>
    </div>
);

export default TermsAndConditions;
