import React from 'react';

const menu = [
    {
        id       : 'topMenuTrading',
        url      : '/trading',
        text     : 'Trade',
        className: 'ja-hide gr-hide-m gr-hide-p ico-only-hide',
    },
    {
        id       : 'topMenuJPTrading',
        url      : '/multi_barriers_trading',
        text     : 'Trade',
        className: 'invisible ja-show gr-hide-m gr-hide-p',
    },
    {
        id       : 'topMenuPortfolio',
        url      : '/user/portfoliows',
        text     : 'Portfolio',
        className: 'client_logged_in invisible ico-only-hide',
    },
    {
        id       : 'topMenuProfitTable',
        url      : '/user/profit_tablews',
        text     : 'Profit Table',
        className: 'client_logged_in invisible ico-only-hide',
    },
    {
        id       : 'topMenuStatement',
        url      : '/user/statementws',
        text     : 'Statement',
        className: 'client_logged_in invisible',
    },
    { // cashier
        id  : 'topMenuCashier',
        url : '/cashier',
        text: 'Cashier',
    },
    { // resources
        id       : 'topMenuResources',
        url      : '/resources',
        text     : 'Resources',
        className: 'client_logged_out client_logged_in invisible ico-only-hide',
        sub_items: [
            {
                id       : 'topMenuAssetIndex',
                url      : '/resources/asset_indexws',
                text     : 'Asset Index',
                className: 'ja-hide',
            },
            {
                id  : 'topMenuTradingTimes',
                url : '/resources/market_timesws',
                text: 'Trading Times',
            },
        ],
    },
    {
        id       : 'topMenuMetaTrader',
        url      : '/user/metatrader',
        text     : 'MetaTrader',
        className: 'client_logged_in invisible',
    },
    {
        id          : 'topMenuShop',
        text        : 'Shop',
        absolute_url: 'https://shop.binary.com',
        className   : 'ja-hide ico-only-hide',
        target      : '_blank',
    },
    {
        id       : 'topMenuPaymentAgent',
        url      : '/paymentagent/transferws',
        text     : 'Payment Agent',
        className: 'invisible',
    },
];

const Menu = () => (
    menu.map((item, idx) => {
        const url = item.url ? it.url_for(item.url) : item.absolute_url;

        return (
            <li key={idx} id={item.id} className={`item ${item.className || ''}`}>
                <a className='link' href={url} target={item.target || undefined}>
                    { it.L(item.text)}
                </a>
                { item.sub_items &&
                    <ul className='sub_items'>
                        { item.sub_items.map((sub_item, sub_idx) => (
                            <li key={sub_idx} id={sub_item.id} className={`sub_item ${sub_item.className || ''}`}>
                                <a className='link' href={it.url_for(sub_item.url)} target={sub_item.target || undefined}>
                                    { it.L(sub_item.text)}
                                </a>
                            </li>
                        ))}
                    </ul>
                }
            </li>
        );
    })
);

export default Menu;
