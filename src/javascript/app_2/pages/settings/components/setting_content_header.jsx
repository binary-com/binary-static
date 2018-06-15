import React from 'react';

export const SettingContentHeader = ({title, content}) => (
    <div className='settings__content_header_container'>
        <h2 className='settings__content_header_title'>{title}</h2>
        <h4 className='settings__content_header_description'>{content}</h4>
    </div>
);