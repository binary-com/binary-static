import React          from 'react';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import PageError      from 'Modules/PageError';

const Page404 = () => (
    <PageError
        header={localize('Oops, page not available.')}
        message={localize('The page you requested could not be found. Either it no longer exists or the address is wrong. Please check for any typos.')}
        error_code={localize('Error code: 404')}
        redirect_url={routes.trade}
        redirect_label={localize('Return to Trade')}
    />
);

export default Page404;
