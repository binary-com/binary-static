import React        from 'react';
import { localize } from '_common/localize';
import Icon         from 'Assets/Common/icon.jsx';
import IconFlag     from 'Assets/Contract/icon-flag.jsx';
import IconTick     from 'Assets/Contract/icon-tick.jsx';

export const getHeaderConfig = () => ({
    purchased: { title: localize('Contract Purchased'), icon: <Icon icon={IconTick} /> },
    won      : { title: localize('Contract Won'),       icon: <Icon icon={IconFlag} /> },
    lost     : { title: localize('Contract Lost'),      icon: <Icon icon={IconFlag} /> },
});
