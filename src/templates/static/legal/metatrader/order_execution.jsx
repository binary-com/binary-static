import React from 'react';

const OrderExecution = () => (
    <div>
        <h2 data-anchor='order-execution-policy'>{it.L('Order Execution Policy')}</h2>

        <h2 data-anchor='introduction'>{it.L('A. Introduction')}</h2>
        <p>
            {it.L('The term \'we\', \'us\', \'our\', \'ours\', \'the Company\', \'[_1]\' shall denote', it.website_name)}&nbsp;
            <span className='eu-hide'>{it.L('Binary (V) Ltd,')}&nbsp;</span>
            <span className='eu-hide'>{it.L('Binary (FX) Ltd, or')}&nbsp;</span>
            <span>{it.L('Binary Investments (Europe) Ltd.')}</span>
        </p>

        <p>{it.L('Our Order Execution Policy (the "Policy") sets out the overview and approach of how [_1] executes orders on behalf of our clients.', it.website_name)}</p>
        <p>{it.L('The Policy is supplemented by Appendix A which provide further details to our considerations as they are related to differing asset classes. The accompanying Appendix A should be read in conjunction with this Policy.')}</p>

        <h2 data-anchor='scope'>{it.L('B. Scope')}</h2>
        <p>{it.L('This Policy applies to retail and professional clients of [_1] dealing in financial products offered by [_1].', it.website_name)}</p>

        <h2 data-anchor='definition-of-best-execution'>{it.L('C. Definition of Best Execution')}</h2>
        <p>{it.L('Best execution is the requirement to take all sufficient steps to obtain, when executing orders, the best possible result for you taking into account price, costs, speed, likelihood of execution and settlement, size, nature or any other consideration relevant (hereinafter referred to as the "execution factors") to the execution of the order.')}</p>

        <h2 data-anchor='client-instructions'>{it.L('D. Client Instructions')}</h2>
        <p>{it.L('When we accept an order from you to open or close a transaction, or any other specific instructions in relation to your order, we will endeavor to follow your instructions as far as reasonably possible, acting in accordance with our duty of best execution in accordance with your instructions. These specific instructions include, but are not limited to:')}</p>
        <ul>
            <li>{it.L('a) The venue at which your order will be executed;')}</li>
            <li>{it.L('b) The price at which your order will be executed;')}</li>
            <li>{it.L('c) The time at which your order will be executed; and')}</li>
            <li>{it.L('d) The timeframe or duration of the contract as defined by your order execution.')}</li>
        </ul>
        <p>{it.L('Where a particular venue has been specified in your instructions with respect to the execution of an order, we will not be responsible for the venue selection.')}</p>
        <p>{it.L('Where a particular time or timeframe has been specified in a client\'s instructions with respect to the execution of an order, regardless of the price available, we will endeavor to execute the order at the specified time or over the specified timeframe in the best possible manner after taking all sufficient steps. However, we will not be responsible for any consequences related to pricing that resulted from the time or timeframe of the execution.')}</p>
        <p>{it.L('Aspects of a client order not affected by specific instructions are subject to the application of [_1]\'s Order Execution Policy. In the absence of specific instructions from our clients, we will exercise our own discretion in determining the factors that are required to be taken into account for the purpose of providing you with best execution, having regard to the execution criteria listed below:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('the characteristics of the client;')}</li>
            <li>{it.L('the characteristics of the order;')}</li>
            <li>{it.L('the characteristics of financial instruments that are the subject of that order;')}</li>
            <li className='no-bullet'>{it.L('and')}</li>
            <li>{it.L('the characteristics of the execution venues to which that order can be directed.')}</li>
        </ul>

        <h2 data-anchor='best-execution-obligation'>{it.L('E. Best Execution Obligation')}</h2>
        <p>{it.L('[_1] owes you a duty of best execution when executing orders on your behalf, i.e., when you are placing a legitimate reliance on us to safeguard your interest in relation to the execution of your order.', it.website_name)}</p>
        <p>{it.L('In executing orders on your behalf, [_1] takes into consideration the following to achieve the best possible result for you:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('Price - the price at which the transaction in relation to your order is executed at.')}</li>
            <li>{it.L('Costs - the costs of executing your order comprised predominantly of spread, i.e., the difference between our bid and our offer price.')}</li>
            <li>{it.L('Speed - the speed at which your order can be executed.')}</li>
            <li>{it.L('Likelihood of execution and settlement - the depth of liquidity of the market in which your order is related to.')}</li>
            <li>{it.L('Size - the size of your order determined by the volume (number of lots).')}</li>
            <li>{it.L('Any other consideration relevant to the execution of the transaction.')}</li>
        </ul>
        <p>{it.L('The factor listed above are not listed in order of priority. Ordinarily, price will merit a high relative importance in obtaining the best possible result for you. However, the relative importance of the listed factors above may change in accordance with:')}</p>
        <ul className='bullet'>
            <li>{it.L('the specific instructions that we receive from you;')}</li>
            <li>{it.L('the market conditions of the financial instruments that your orders are related to, which includes the need for timely execution, availability of price improvement, liquidity of the market, size of your order, and the potential impact on total consideration.')}</li>
        </ul>
        <p>{it.L('Our determination of the relative importance of the execution factors may differ from yours during certain circumstances, acting in your interest in accordance with our obligation of best execution.')}</p>

        <h2 data-anchor='execution-venues'>{it.L('F. Execution Venues')}</h2>
        <p>{it.L('[_1] offers forex and contracts for differences via the hybrid model, i.e., dealing on own account (dealing desk – B-book) or partially hedging client orders with our liquidity providers (no-dealing desk – A-book).', it.website_name)}</p>
        <p>{it.L('When we deal on own account (dealing desk), we act as principal and not as an agent on your behalf and we therefore act as the execution venue.')}</p>
        <p>{it.L('Whilst we act as principal in respect of your orders, we also assess the execution venues that we use and upon which we place significant reliance to provide the best possible result for the execution of your orders. These venues typically consist of third party investment firms, brokers, and/or liquidity providers.')}</p>
        <p>{it.L('[_1] assesses the choice of external execution venues regularly (at least once a year) with the intention of achieving a better result for you based on our best execution obligation.', it.website_name)}</p>

        <h2 data-anchor='order-handling'>{it.L('G. Order Handling')}</h2>
        <p>{it.L('All client orders are processed on a first in first out basis without any manual intervention. When executing your order, [_1] will seek to fill your order transaction as promptly as possible, at the instructed price (or at a better price, if available). Exposure limits are established based on internal governance arrangements and risk management framework which commensurate with the size, nature, complexity, and risk profile of our activities. These exposure limits are used as benchmarks to distinguish orders that are auto-accepted and orders that will be worked in the market with fill level passed on to the client.', it.website_name)}</p>

        <h2 data-anchor='monitoring-and-review'>{it.L('H. Monitoring and Review')}</h2>
        <p>{it.L('We will monitor the effectiveness of our order execution arrangements and order execution policy. We will assess from time to time whether the venues relied upon by us in pricing our Contracts on your behalf allow us to achieve best execution on a consistent basis or whether we need to make changes to our execution arrangements. We will also review our order execution arrangements and order execution policy in respect of material changes either in respect of one of our chosen pricing venues or that otherwise affect our ability to continue to achieve best execution. Should there be any material changes to our order execution arrangements or order execution policy, we will notify you.')}</p>

        <h2 data-anchor='appendix-product-specific-policies'>{it.L('Appendix - Product Specific Policies')}</h2>

        <h2 data-anchor='spot-fx'>{it.L('A. Spot FX')}</h2>
        <p>{it.L('For features and trading illustration of Spot FX offered by [_1], refer to the Product Disclosure Statement. This policy is an appendix to the overarching [_1] Order Execution Policy and should be read in conjunction with the overarching [_1] Order Execution Policy.', it.website_name)}</p>
        <p>{it.L('[_1] provides you best execution by utilising a smart aggregation method when managing incoming orders. The smart aggregation method works by:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('consolidating liquidity from several providers into a single stream of blended feed; and')}</li>
            <li>{it.L('intelligently routing incoming orders to different types of execution modes based on configurations and algorithms established using best execution factors.')}</li>
        </ul>
        <p>{it.L('By default, the intelligent order routing system ensures that the top of the book is always comprised of the best bid and offer rates quoted by the competing liquidity providers. However, during times of market illiquidity, this may change with likelihood of execution being the primary execution factor.')}</p>
        <p>{it.L('Depending on the level of risk that we are exposed to acting as your counterparty, we largely act in a principal capacity of your trades. As such, the execution venue will usually be [_1]. However, we may transmit your order to third party liquidity providers, in which case we will determine the execution venue ourselves on the basis described above.', it.website_name)}</p>
        <p>{it.L('The execution venues are assessed, on a regular basis, whether the they provide for the best possible result for our clients.')}</p>
    </div>
);

export default OrderExecution;
