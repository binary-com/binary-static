import React            from 'react';
import { fillTemplate } from '../../../Utils/Language/fill_template';
import { localize }     from '../../../../_common/localize';

const Localize = ({ str, replacers }) => {
    const localized = localize(str);
    if (!/\[_\d+\]/.test(localized)) return <React.Fragment>{localized}</React.Fragment>;
    return (
        <React.Fragment>
            {fillTemplate(localized, replacers)}
        </React.Fragment>
    );
};

export default Localize;
