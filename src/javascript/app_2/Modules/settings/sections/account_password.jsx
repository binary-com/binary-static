import React from 'react';
import PropTypes from 'prop-types';
import Section from '../components/section.jsx';

const AccountPassword = ({title, description}) => (
    <Section title={title} description={description}>
        {/* content here */}
    </Section>
);

AccountPassword.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default AccountPassword;
