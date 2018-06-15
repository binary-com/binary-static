import React from 'react';

export const SettingContentHeader = ({title, content}) => (
    <div className='settings__content_header_container'>
        <div className='settings__content_header_title'>{title}</div>
        <div className='settings__content_header_description'>{content}</div>
    </div>
);