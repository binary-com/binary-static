import React    from 'react';
import FlagIcon from '../../../../Modules/Contract/Components/Icons/flag.jsx';
import TickIcon from '../../../../Modules/Contract/Components/Icons/tick.jsx';

export const header_config = {
    purchased: { title: 'Contract Purchased', icon: <TickIcon /> },
    won      : { title: 'Contract Won',       icon: <FlagIcon /> },
    lost     : { title: 'Contract Lost',      icon: <FlagIcon /> },
};
