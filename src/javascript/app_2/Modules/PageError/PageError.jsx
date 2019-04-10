import PropTypes      from 'prop-types';
import React          from 'react';
import { localize }   from '_common/localize';
import { ButtonLink } from 'App/Components/Routes';
import ErrorBox       from 'App/Components/Elements/ErrorBox';

const PageError = ({
    buttonOnClick,
    error_code,
    header,
    message,
    redirect_label,
    redirect_url,
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

PageError.propTypes = {
    buttonOnClick : PropTypes.func,
    error_code    : PropTypes.number,
    header        : PropTypes.string,
    message       : PropTypes.string,
    redirect_label: PropTypes.string,
    redirect_url  : PropTypes.string,
};

export default PageError;
