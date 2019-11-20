import React from 'react';

const DataFeed = () => (
    <div>
        <h2 data-anchor='data-feed'>{it.L('Data feed')}</h2>
        <p>{it.L('Here is some information about the data feeds used by the Company.')}</p>

        <h2 data-anchor='differences-with-other-data-feeds'>{it.L('Differences with other data feeds')}</h2>
        <p>{it.L('The Company\'s data feed may at times differ slightly from other data feeds found on the Internet (which may themselves differ from each other). Reasons for differences in feed providers include:')}</p>

        <ul>
            <li>{it.L('For forex: The forex market is an OTC (over the counter) market, where banks and other major financial institutions trade currencies amongst themselves without there being any central clearing house. Accordingly, there is no \'official\' price source for forex quotes. Different data feeds will contain quotes from a different sub-set of international banks. Accordingly, prices may differ among providers, depending on which bank(s) they obtain prices from.')}</li>
            <li>{it.L('Market-closing times: The client is asked to refer to [_1]Trading times[_2] page for the exact time of settlement for all contracts. Other websites may adopt a different convention (for example, some websites choose 4 o\'clock NY time or 5 o\'clock London time). As a result, the open, high, low, and closing prices displayed on the Company\'s website may differ from those on other websites, due to the market-closing time convention.', `<a href=${it.url_for('resources/market_timesws')}>`, '</a>')}</li>
            <li>{it.L('Use of Bid/Ask: When the market is illiquid, the data feed may contain many Bids and Asks, without there actually being any traded price for quite a while. By taking an average of the Bid/Ask (i.e. bid + ask, divided by 2), a market quote is generated that reflects the current market, without it actually being a traded price. The Company\'s system will generate prices from these Bids and Asks, whereas other websites might not. As a result, the Company\'s website might display ticks that do not appear in the data feeds of other websites.')}</li>
        </ul>
        <p>{it.L('The Company\'s data feed is designed to be one of the best and most robust available for a trading environment.')}</p>

        <h2 data-anchor='weekend-quotes'>{it.L('Weekend quotes')}</h2>
        <p>{it.L('The client is asked to note that weekend quotes are ignored for the purpose of contract settlement. During weekends, the forex markets may occasionally generate prices; however, these prices are often artificial (traders sometimes take advantage of the illiquidity of the markets during weekends to push prices up or down). To avoid settling prices based on such artificial prices, it is Company\'s policy not to count weekend prices towards contract settlement values (except for Synthetic Indices, which are open during weekends).')}</p>
    </div>
);

export default DataFeed;
