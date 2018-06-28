import React from 'react';
import PropTypes from 'prop-types';

export const SettingContentHeader = ({title, content}) => (
    <div className='settings__content_header_container'>
        <div className='settings__content_header_title'>{title}</div>
        <div className='settings__content_header_description'>{content}</div>
    </div>
);

SettingContentHeader.propTypes = {
    title  : PropTypes.string,
    content: PropTypes.string,
};
