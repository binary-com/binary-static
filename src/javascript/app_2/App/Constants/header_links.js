import React        from 'react';
import { localize } from '_common/localize';
import {
    IconPortfolio,
    IconStatement,
    IconTrade }     from 'Assets/Header/NavBar/index';
import { routes }   from 'Constants/index';

const header_links = [
    {
        icon   : <IconTrade className='ic-header__trade' />,
        text   : localize('Trade'),
        link_to: routes.trade,
    },
    {
        icon   : <IconPortfolio className='ic-header__portfolio' />,
        text   : localize('Portfolio'),
        link_to: routes.portfolio,
    },
    {
        icon   : <IconStatement className='ic-header__statement' />,
        text   : localize('Statement'),
        link_to: routes.statement,
    },
    // { icon: <IconCashier />,   text: localize('Cashier') },
];

export default header_links;
