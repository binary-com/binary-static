import React          from 'react';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import { ButtonLink } from 'App/Components/Routes';
import ErrorBox       from 'App/Components/Elements/ErrorBox';

const Page404 = () => (
    <div className='page-error__container'>
        <ErrorBox
            header={localize('Oops... Page Not Available')}
            message={
                <React.Fragment>
                    { localize('The page you requested could not be found. Either it no longer exists or the address is wrong. Please check for any typos.') }
                    <br /><br />
                    { localize('Error code: 404') }
                </React.Fragment>
            }
        >
            <hr className='hr page-error__hr' />
            <ButtonLink
                className='page-error__btn btn--primary btn--primary--orange'
                to={routes.trade}
            >
                <span className='page-error__btn-text btn__text'>
                    {localize('Return')}
                </span>
            </ButtonLink>
        </ErrorBox>
    </div>
);

export default Page404;
