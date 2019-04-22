import React           from 'react';
import { localize }    from '_common/localize';
import { ReportsMeta } from '../Components/reports-meta.jsx';

// TODO Add proper messages before the PR
const OpenPositions = () => (
    <ReportsMeta
        i18n_heading={localize('Open Positions')}
        i18n_message={localize('Vestibulum rutrum quam fringilla tincidunt. Suspendisse nec tortor.')}
    />
);

export default OpenPositions;
