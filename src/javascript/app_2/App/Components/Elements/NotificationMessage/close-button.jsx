import PropTypes from 'prop-types';
import React     from 'react';

const CloseButton = ({ onClick }) => (
    <button
        className='notification-message__close-button'
        type='button'
        onClick={onClick}
    />
);

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default CloseButton;
