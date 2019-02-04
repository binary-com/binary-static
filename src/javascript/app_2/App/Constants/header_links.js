import React        from 'react';
import { localize } from '_common/localize';
import {
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
        // TODO: Combine portfolio and statement into reports page
        icon   : <IconStatement className='ic-header__statement' />,
        text   : localize('Reports'),
        link_to: routes.statement,
    },
];

export default header_links;
