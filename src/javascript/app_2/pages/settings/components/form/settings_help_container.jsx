import React from 'react';
import PropTypes from 'prop-types';

export const SettingsHelpContainer = ({children}) => (
    <div className='settings__help_container'>
        {children}
    </div>
);

SettingsHelpContainer.propTypes = {
    children: PropTypes.array,
};
