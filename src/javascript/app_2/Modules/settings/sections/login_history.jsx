import React from 'react';
import PropTypes from 'prop-types';
import Section from '../components/section.jsx';

const LoginHistory = ({ title, description }) => (
    <Section title={title} description={description}>
        {/* content here */}
    </Section>
);

LoginHistory.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default LoginHistory;
