import React from 'react';
import { StaticHeader } from '../../../javascript/app_2/pages/trading/components/elements/header.jsx';

const Header = () => (
    <StaticHeader items={[
        { icon: 'trade',     text: it.L('Trade') },
        { icon: 'portfolio', text: it.L('Portfolio') },
        { icon: 'statement', text: it.L('Statement') },
        { icon: 'cashier',   text: it.L('Cashier') },
    ]} />
);

export default Header;
