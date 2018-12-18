import React          from 'react';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import { ButtonLink } from 'App/Components/Routes';
import { Icon404 }    from './Icon404.jsx';
import ErrorBox       from '../../../App/Components/Elements/ErrorBox';

const Page404 = () => (
    <div className='page-error-container'>
        <ErrorBox
            header={localize('Page not found')}
            icon={<Icon404 />}
            message={localize('Sorry, we couldn\'t find the page you are looking for.')}
        >
            <ButtonLink
                className='secondary orange'
                to={routes.trade}
            >
                <span>
                    {localize('Go to trade page')}
                </span>
            </ButtonLink>
        </ErrorBox>
    </div>
);

export default Page404;
