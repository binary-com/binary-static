import React from 'react';

const BIEL = () => (
    <div data-show='eucountry'>
        <h2 data-anchor='supplementary-terms-and-conditions-biel'>{it.L('Supplementary terms and conditions for Financial Products offered by Deriv Investments (Europe) Limited')}</h2>
        <p>{it.L('These supplementary terms and conditions (these "ST&Cs") apply solely to the clients of Deriv Investments (Europe) Limited ("DIEL") and will govern the relationship between the client and DIEL when trading Financial Products (as defined below) with DIEL.')}</p>
        <p>{it.L('Under these ST&Cs, the client may enter into Transactions in the following investments and instruments, all of which are over-the-counter ("OTC") products:')}</p>
        <ol>
            <li>{it.L('Rolling Spot Forex')}</li>
            <li>{it.L('CFDs on commodities')}</li>
            <li>{it.L('CFDs on indices')}</li>
        </ol>
        <p>{it.L('The trading services described in this agreement are OTC. This means that one or more of the Underlying Instruments in which the client transacts with DIEL, though quoted on an exchange, are not traded on an exchange when transacted through the electronic trading platform as described in this agreement.')}</p>
        <p>{it.L('The client\'s trades will be carried out on an execution-only basis through our online platform.')}</p>
        <p>{it.L('The Company does not provide and is not authorised to provide investment advice. The Company will not make personal recommendations or advise on the merits of buying and/or selling in particular investments.')}</p>
        <p>{it.L('The client acknowledges that any explanations, trading recommendations, independent investment research, market commentary, or any other information provided by DIEL is provided to the client as marketing communication and/or educational material, for information purposes only, and does not construe any personal advice on the merits of investing.')}</p>

        <h2 data-anchor='risk-acknowledgement'>{it.L('Risk acknowledgement')}</h2>
        <p>{it.L('By entering into an agreement with DIEL, the client understands that CFDs are highly speculative, complex products and carry a high degree of risk, especially those traded on Margin. Whilst the client may generate profit and increase their capital, they may also expose themselves to losing the entire sum invested, and their loss may exceed their deposit. The products referred to in this agreement are not appropriate for everyone. The client acknowledges that the trading services described in this agreement are designed for clients who are knowledgeable and experienced in the types of Transactions described in this agreement, and the client fully understands the associated risks before entering into this agreement with DIEL.')}</p>
        <p>{it.L('The client acknowledges, recognises, and understands that')}</p>
        <ol>
            <li>{it.L('Because of the leverage effect, the Margin required in Margined Transactions, and price changes in the Underlying Instruments, the client may suffer significant losses.')}</li>
            <li>{it.L('Transaction monitoring is the client\'s responsibility in its entirety. The Company shall not conduct any monitoring of the client\'s trades.')}</li>
            <li>{it.L('There are no guaranteed profits in investment trading.')}</li>
            <li>{it.L('Transactions in CFD instruments are traded outside a stock exchange or OTF or MTF.')}</li>
            <li>{it.L('The client is not trading in the actual Underlying Instrument, or the actual foreign currency; all Transactions are settled in cash only.')}</li>
        </ol>
        <p>{it.L('The client should not sign up to receive the trading services described in this agreement unless they understand the nature of these services and the associated risks.')}</p>

        <h2 data-anchor='provision-of-service'>{it.L('Provision of service')}</h2>
        <p>{it.L('Deriv Investments (Europe) Limited aggregates the Bid and Ask prices from a pool of liquidity providers to determine and offer the client the best available price of the instrument. The Company is always the final counterparty to the client\'s Transactions. The Company may execute Orders on behalf of its client, wherein the Company will act as a broker and pass on the Order to the liquidity provider for execution. Alternatively, the Company may also keep the client\'s Order on its own account, wherein the Company will take the other side of the client\'s trade. It is further noted that the Company may make a profit as a result of the client\'s losses and vice-versa. Further details can be found under Conflicts of interest policy and Order execution policy.')}</p>
        <p>{it.L('The provision of the trading services described in this agreement utilises a third-party system acquired via a non-exclusive, non-transferable, non-sub-licensable, terminable licence from the third-party system provider/licensor (the "MT5 trading platform"). The client acknowledges that, when providing trading services described in this agreement to the client, DIEL may decide to change its third–party system provider/licensor and use a trading platform other than the MT5 trading platform. Hence, in such cases, DIEL may decide to use an entirely new third–party system provider/licensor (hereinafter referred to as the "new trading platform") or to introduce an additional third–party system provider/licensor (hereinafter referred to as the "additional trading platform").')}</p>
        <p>{it.L('If DIEL decides to introduce a new trading platform, it shall provide the client with a relevant notice within 30 days before it introduces the new trading platform or the additional trading platform. In such a notice, DIEL will outline information including, but not limited to, features and operations of the new trading platform. Thus, using its backup database on the MT5 trading platform, DIEL shall integrate all data to the new trading platform, including but not limited to open trades, historical trades/data, and accounts.')}</p>

        <h2 data-anchor='account-management'>{it.L('Account management')}</h2>
        <ol>
            <li><strong>{it.L('Opening an MT5 Real Account')}</strong>
                <p>{it.L('To be able to trade OTC instruments available on the MT5 trading platform, the client has to first')}</p>
                <ol>
                    <li>{it.L('Open a [_1] account through DIEL\'s website [_2]', it.website_name, `<a href=${it.url_for('new-account')} target="_blank">www.binary.com</a>`)}</li>
                    <li>
                        <p>{it.L('a. Access the MT5 trading platform through the direct link [_1] from DIEL\'s web interface, or', `<a href=${it.url_for('platforms')} target="_blank">https://www.binary.com/en/platforms.html</a>`)}</p>
                        <p>{it.L('b. Download and install the MT5 trading platform through the link [_1]', `<a href=${it.url_for('user/metatrader')} target="_blank">https://www.binary.com/en/user/metatrader.html</a>`)}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Payments & withdrawals')}</strong>
                <ol>
                    <li>{it.L('Funding of the MT5 Real Account')}
                        <p>{it.L('When the client transfers their money to DIEL for trading purposes, the client\'s funds are deposited in their [_1] account. If the client chooses to trade FX and CFDs, the client shall transfer funds from their [_1] account to their MT5 Real Account. Such a transfer shall not be regarded as a transfer from two different accounts but as a transfer of funds from the client\'s centralised [_1] account to the MT5 Real Account. No fund transfers shall be made to any other account in the name of any third party.', it.website_name)}</p>
                        <p>{it.L('The client agrees to comply with the following when making payments to DIEL:')}</p>
                        <ol>
                            <li>{it.L('Deposits and/or payments due are to be made in the currency chosen by the client from the ones specified by DIEL from time to time.')}</li>
                            <li>{it.L('The client is responsible for all third-party electronic transfer fees in respect of payments.')}</li>
                            <li>{it.L('Payments made to DIEL will only be deemed to have been received once DIEL receives cleared funds.')}</li>
                            <li>{it.L('The client bears the responsibility of ensuring that payments made to DIEL are correctly received with the specified client\'s account details.')}</li>
                        </ol>
                        <p>{it.L('There are no charges for transferring money from the client\'s [_1] account to their MT5 Real Account.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Transfer of funds from the MT5 Real Account')}
                        <p>{it.L('If the client has a positive balance in their MT5 Real Account, they may transfer such balance from their MT5 Real Account into their [_1] account and then request a withdrawal as necessary for any amount available on their [_1] account. The Company may withhold, deduct, or refuse to make any such transfer or withdrawal, in whole or in part, if', it.website_name)}</p>
                        <ol>
                            <li>{it.L('The client has Open Positions on the account that show a loss.')}</li>
                            <li>{it.L('Such a transfer would result in the client\'s Account Equity dropping to less than zero.')}</li>
                            <li>{it.L('The requested transfer would reduce the client\'s Account Balance to less than the Margin required for the client\'s Open Positions.')}</li>
                            <li>{it.L('The Company reasonably considers that funds may be required to meet any current or future Margin Requirements on Open Positions due to the underlying market conditions.')}</li>
                            <li>{it.L('The Company reasonably determines that there is an unresolved dispute between the Company and the client relating to the agreed terms and conditions.')}</li>
                            <li>{it.L('There is an amount outstanding from the client to DIEL.')}</li>
                            <li>{it.L('DIEL is required to do so in accordance with any relevant law or regulation.')}</li>
                        </ol>
                        <p>{it.L('The client\'s MT5 Real Account, as well as all payments and withdrawals therefrom, must be made in the same currency as maintained in the client\'s [_1] account; otherwise, a currency conversion fee shall be applied.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Negative Balance Protection')}
                        <p>{it.L('When using the MT5 trading platform, all DIEL\'s clients will be provided with Margin monitoring functionality to protect the clients from encountering negative balances when trading under normal market conditions. As a trader, the client should always maintain the appropriate levels of Margin in their trading account as the recommended method of their own risk management.')}</p>
                        <p>{it.L('If the client\'s usable Margin drops below 100%, a Margin Call mode will be triggered and maintained till the level of 50%. In the event that the client\'s Margin Level is equal to, or drops below 50%, the Company will initiate the closing of the client\'s current Open Positions, starting from the most unprofitable, until the required Margin Level is achieved. In such events, the positions will be automatically closed at the current market price at that point in time.')}</p>
                        <p>{it.L('In exceptional circumstances, where there is a price change in the underlying that is sufficiently large and sudden, gapping can occur. In such cases, the automatic Margin close-out protection might fail, causing the client\'s Account Balance to fall below zero. For this purpose, a Negative Balance Protection mechanism has been introduced. Negative Balance Protection provides a \'backstop\' in case of extreme market conditions and ensures that the client\'s maximum losses from trading CFDs, including all related costs, are limited to the balance available on the client\'s CFD account. Therefore, the client can never lose more money than the total sum invested for trading CFDs; if the client\'s CFD account balance falls below zero, the Company will compensate the negative balance as soon as possible without any additional cost to the client.')}</p>
                        <p>{it.L('Negative Balance Protection does not apply to the clients categorised as Professional Traders, who can still lose more money than their available balance.')}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Account closure')}</strong>
                <p>{it.L('If the client wishes to withdraw funds from their MT5 Real Account and/or close their MT5 Real Account, the client may notify the Company via [_1]live chat[_2]. The client\'s MT5 Real Account may be closed if the client does not have any Open Positions and all amounts due to the Company have been settled.', `<a href=${it.url_for('contact')} target="_blank">`, '</a>')}</p>
            </li>
        </ol>

        <h2 data-anchor='market-execution'>{it.L('Market execution')}</h2>
        <p>{it.L('On the MT5 trading platform, the client will benefit from direct market access that gives the client the opportunity to receive the best possible price in the market at a specified time, without having to use a dealing desk.')}</p>
        <p>{it.L('As a result, the client\'s trades are executed at market as follows:')}</p>
        <ol>
            <li>{it.L('The price of the client\'s chosen investment appears on the platform/on the client\'s screen.')}</li>
            <li>{it.L('By clicking buy or sell, the client\'s Order will be filled at the best possible price with either one of the Company\'s liquidity providers or on the Company\'s own books (according to the best streaming price at the time of the client\'s Order placement).')}</li>
            <li>{it.L('When the Order hits the liquidity provider\'s server, or the Company\'s server in case the Order is taken on DIEL\'s own books, it is fulfilled.')}</li>
        </ol>
        <p>{it.L('The client is advised to note that prices can change very quickly in the market, so the execution price may not necessarily be visible instantly once the Order has been filled.')}</p>
        <p>{it.L('The client is also reminded that their internet connection can influence what price is displayed after the trade has been executed.')}</p>

        <h2 data-anchor='expert-advisors'>{it.L('Expert Advisors')}</h2>
        <p>{it.L('Expert Advisors, including any additional functions/plug-ins of trading operations provided by or developed using Expert Advisors, are applications developed using the MetaQuotes Language which can be used to analyse price charts and automate the client\'s trades.')}</p>
        <p>{it.L('Expert Advisors, made available on the MT5 trading platform, are owned by MetaQuotes Software Corporation (the MT5 trading platform licensor) and shall remain the exclusive property of MetaQuotes Software Corporation.')}</p>
        <p>{it.L('The Company is an independent legal entity and is not affiliated with the MT5 trading platform. MT5 is not owned, controlled, or operated by the Company. Therefore, the Company does not provide any warranties related to any MT5 product or service and has not reviewed or verified any performance results that may be presented and/or described on this website in relation to MT5.')}</p>
        <p>{it.L('There are no restrictions to the use of Expert Advisors on the MT5 trading platform apart from unethical trading.')}</p>

        <p>{it.L('As an example, Expert Advisors might be able to be programmed for')}</p>
        <ol>
            <li>{it.L('Alerting clients of a potential trading opportunity')}</li>
            <li>{it.L('Execution of trades automatically on their behalf')}</li>
            <li>{it.L('Managing of various aspects of online trading such as sending Orders to the platform')}</li>
            <li>{it.L('Automatic adjustments of Take Profit levels')}</li>
            <li>{it.L('Trailing stops')}</li>
            <li>{it.L('Stop Loss Orders')}</li>
        </ol>
        <p>{it.L('Before using the trading robots or Expert Advisors and forward trade, the client should test it on a demo account.')}</p>
        <p>{it.L('Actual trading results may not correspond to optimised or back-tested results.')}</p>
        <p>{it.L('All software is to be used at the client\'s own risk. The Company will not be liable for any financial losses incurred using a third-party software. The Company is not associated with the development of the automated trading software or the Expert Advisors because they are exclusively developed and supported by third parties and not by the Company. The Company does not receive any form of financial and/or other benefits from permitting Expert Advisors to be used.')}</p>
        <p>{it.L('The client shall accept the risk of using any additional functions provided by the Expert Advisor on the MT5 trading platform. The Company has no responsibility for the outcome of such trading and reserves the right to accept or reject the use of such functions with absolute discretion.')}</p>
        <p>{it.L('Where such additional functions/plug-ins affect the reliability and/or smooth operation and/or orderly functioning of the MT5 trading platform, the Company has the right to immediately terminate its contractual relationship with its clients by written notice.')}</p>
        <p>{it.L('By using the electronic trading system, including the MT5 trading platform, clients accept full responsibility for using such platforms and for any Orders transmitted via such platforms.')}</p>
        <p>{it.L('All unforeseen openings or closings of positions initiated by the Expert Advisor, whether relevant to system error or otherwise, are out of the scope of the Company\'s responsibility; hence the Company is not liable for such actions or results.')}</p>

        <h2 data-anchor='governing-law-and-jurisdiction'>{it.L('Governing law and jurisdiction')}</h2>
        <p>{it.L('These ST&Cs are to be governed by and construed in accordance with Maltese law, and the parties hereto agree to submit to the non-exclusive jurisdiction of the Maltese courts.')}</p>
    </div>
);

export default BIEL;
