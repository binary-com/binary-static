import React    from 'react';
import IconFlag from 'Assets/Contract/icon_flag.jsx';
import IconTick from 'Assets/Contract/icon_tick.jsx';

export const header_config = {
    purchased: { title: 'Contract Purchased', icon: <IconTick /> },
    won      : { title: 'Contract Won',       icon: <IconFlag /> },
    lost     : { title: 'Contract Lost',      icon: <IconFlag /> },
};
