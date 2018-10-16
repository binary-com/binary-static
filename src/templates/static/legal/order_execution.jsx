import React from 'react';

const OrderExecution = () => (
    <div>
        <h2 data-anchor='summary-order-execution-policy'>{it.L('Summary Order Execution Policy')}</h2>
        <p>{it.L('We have a general duty to conduct our business with you honestly, fairly, and professionally and to act in your best interests when opening and closing Binary Options trades with you.')}</p>
        <p>{it.L('More specifically, when we enter into a Binary Option trade with you (each, a "Contract"), we have a duty to provide you with \'best execution\'. Best execution means that we must take reasonable steps to obtain the best possible result for you when executing an order with you. This document provides a summary of our best execution policy.')}</p>
        <p>{it.L('You should note that our duty to provide you with best execution does not apply to any gaming products that you place with us, where there is no underlying financial market.')}</p>

        <h2 data-anchor='general'>{it.L('General')}</h2>
        <p>{it.L('When we enter into Contracts with you, we will take all reasonable steps to achieve the best possible result for you by executing those Contracts according to our order execution policy and subject to any specific instructions received from you. Our order execution policy comprises a set of procedures that are designed to obtain the best possible execution result for you subject to and taking into account: (a) the nature of your Contracts, (b) the priorities you have identified to us in relation to entering into those Contracts, and (c) the practices relating to the market in question, with the aim of producing a result which provides, in our view, the best balance across a range of sometimes conflicting factors. Our policy cannot provide a guarantee, however, that when entering into Contracts with you, the price will always be better than one which is or might have been available elsewhere.')}</p>

        <h2 data-anchor='best-execution-factors'>{it.L('Best Execution Factors')}</h2>
        <p>{it.L('In relation to Contracts that you enter into with us, we act as principal and not as agent on your behalf and we therefore act as the sole execution venue for the execution of your Contracts.')}</p>
        <p>{it.L('We are required to take a number of factors into account when considering how to give you best execution. We have rated price as the most important followed by: (a) costs; (b) size, (c) liquidity of the underlying market, (d) speed and (e) likelihood of execution and settlement. The main way in which we will ensure that you obtain best execution is by ensuring that in our calculation of our bid/offer prices, we pay due consideration to the market price for the underlying reference product to which your Contract relates. We have access to a number of different data sources in order to ascertain the market price, which is our objective view of the bids and offers available to arms\' length traders.')}</p>
        <p>{it.L('In relation to some Contracts, at the time at which you give us an order there may be no functioning or open market or exchange on which the reference product is traded. In such cases, we set out to determine a fair underlying price based on a number of factors such as price movements on associated markets and other market influences and information about our clients\' own orders.')}</p>

        <h2 data-anchor='specific-instructions'>{it.L('Specific Instructions')}</h2>
        <p>{it.L('Where you give us specific instructions, including for example (a) specifying the price of a Contract with us or (b) specifying the price at which a Contract is to be closed, then those instructions take precedence over other aspects of our policy.')}</p>

        <h2 data-anchor='no-fiduciary-duty'>{it.L('No fiduciary duty')}</h2>
        <p>{it.L('Our commitment to provide you with \'best execution\' does not mean that we owe you any fiduciary responsibilities over and above the specific regulatory obligations placed upon us or as may be otherwise contracted between us.')}</p>

        <h2 data-anchor='monitoring-and-review'>{it.L('Monitoring and review of this Policy')}</h2>
        <p>{it.L('We will monitor the effectiveness of our order execution arrangements and order execution policy. We will assess from time to time whether the venues relied upon by us in pricing our Contracts on your behalf allow us to achieve best execution on a consistent basis or whether we need to make changes to our execution arrangements. We will also review our order execution arrangements and order execution policy in respect of material changes either in respect of one of our chosen pricing venues or that otherwise affect our ability to continue to achieve best execution. Should there be any material changes to our order execution arrangements or order execution policy, we will notify you.')}</p>
    </div>
);

export default OrderExecution;
