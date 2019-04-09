import React          from 'react';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import { ButtonLink } from 'App/Components/Routes';
import ErrorBox       from 'App/Components/Elements/ErrorBox';

const PageError = ({
    header,
    message,
    error_code,
    redirect_url,
    redirect_label,
}) => (
    <div className='page-error__container'>
        <ErrorBox
            header={header}
            message={
                <React.Fragment>
                    { message }
                    <br /><br />
                    <span className='page-error__code'>
                        { error_code }
                    </span>
                </React.Fragment>
            }
        >
            <ButtonLink
                className='page-error__btn btn--primary btn--primary--orange'
                to={redirect_url}
            >
                <span className='page-error__btn-text btn__text'>
                    {redirect_label}
                </span>
            </ButtonLink>
        </ErrorBox>
    </div>
);

export default PageError;
