import React        from 'react';
import { localize } from '_common/localize';
import {
    IconStatement,
    IconTrade }     from 'Assets/Header/NavBar/index';
import { routes }   from 'Constants/index';

const header_links = [
    {
        icon   : <IconTrade className='header__icon' />,
        text   : localize('Trade'),
        link_to: routes.trade,
    },
    {
        icon      : <IconStatement className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.statement,
        login_only: true,
    },
];

export default header_links;
