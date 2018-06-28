import React from 'react';
import PropTypes from 'prop-types';

export const FormSubmitButton = ({value}) => (
    <button className='settings__content_form__submit' type='submit'>
        <span className='settings__content_form__submit_text'>{value}</span>
    </button>
);


FormSubmitButton.propTypes = {
    value: PropTypes.string,
};
