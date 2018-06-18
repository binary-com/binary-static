import React from 'react';
import PropTypes from 'prop-types';

const ContentHeader = ({title, description}) => (
    <div className='settings__content_header_container desktop-only'>
        <h2 className='settings__content_header_title'>{title}</h2>
        <h4 className='settings__content_header_description'>{description}</h4>
    </div>
);

ContentHeader.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default ContentHeader;