import React           from 'react';
import { localize }    from '_common/localize';
import { ReportsMeta } from '../Components/reports-meta.jsx';

// TODO Add proper messages before the PR
const ProfitTable = () => (
    <ReportsMeta
        i18n_heading={localize('Profit Table')}
        i18n_message={localize('Vestibulum rutrum quam fringilla tincidunt. Suspendisse nec tortor.')}
    />
);

export default ProfitTable;
