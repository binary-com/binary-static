import React        from 'react';
import { localize } from '_common/localize';
import IconFlag     from 'Assets/Contract/icon_flag.jsx';
import IconTick     from 'Assets/Contract/icon_tick.jsx';

export const getHeaderConfig = () => ({
    purchased: { title: localize('Contract Purchased'), icon: <IconTick /> },
    won      : { title: localize('Contract Won'),       icon: <IconFlag /> },
    lost     : { title: localize('Contract Lost'),      icon: <IconFlag /> },
});
