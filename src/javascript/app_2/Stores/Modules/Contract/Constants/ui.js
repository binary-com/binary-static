import React    from 'react';
import IconFlag from '../../../../Assets/Icons/flag.jsx';
import IconTick from '../../../../Assets/Icons/tick.jsx';

export const header_config = {
    purchased: { title: 'Contract Purchased', icon: <IconTick /> },
    won      : { title: 'Contract Won',       icon: <IconFlag /> },
    lost     : { title: 'Contract Lost',      icon: <IconFlag /> },
};
