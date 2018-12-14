import React          from 'react';
import { Link }       from 'react-router-dom';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import { Icon404 }    from './Icon404.jsx';
import ErrorBox       from '../../../App/Components/Elements/ErrorBox';

const Page404 = () => (
    <div className='page-error-container'>
        <ErrorBox
            header={localize('Page not found')}
            icon={<Icon404 />}
            message={localize('Sorry, we couldn\'t find the page you are looking for.')}
        >
            <Link
                className='secondary orange '
                to={routes.trade}
            >
                {localize('Go to trade page')}
            </Link>
        </ErrorBox>
    </div>
);

export default Page404;
