import React        from 'react';
import { localize } from '_common/localize';
import { Icon }     from 'Assets/Common';
import {
    IconReports,
    IconTrade }     from 'Assets/Header/NavBar/index';
import { routes }   from 'Constants/index';

const header_links = [
    {
        icon   : <Icon icon={IconTrade} className='header__icon' />,
        text   : localize('Trade'),
        link_to: routes.trade,
    },
    {
        icon      : <Icon icon={IconReports} className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
];

export default header_links;
