import React          from 'react';
import { localize }  from '_common/localize';
import { ButtonLink } from 'App/Components/Routes';
import ErrorBox       from 'App/Components/Elements/ErrorBox';

const PageError = ({
    header,
    message,
    error_code,
    redirect_url,
    redirect_label,
    buttonOnClick,
}) => (
    <div className='page-error__container'>
        <ErrorBox
            header={header}
            message={
                <React.Fragment>
                    { message }
                    { error_code &&
                    <React.Fragment>
                        <br />
                        <br />
                        <span className='page-error__code'>
                            { localize('Error Code : [_1]', error_code) }
                        </span>
                    </React.Fragment>
                    }
                </React.Fragment>
            }
        >
            <ButtonLink
                className='page-error__btn btn--primary btn--primary--orange'
                to={redirect_url}
                onClick={buttonOnClick}
            >
                <span className='page-error__btn-text btn__text'>
                    {redirect_label}
                </span>
            </ButtonLink>
        </ErrorBox>
    </div>
);

export default PageError;
