import React from 'react';
import PropTypes from 'prop-types';
import Section from '../components/section.jsx';

const ApiToken = ({ title, description }) => (
    <Section title={title} description={description}>
        {/* content here */}
    </Section>
);

ApiToken.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default ApiToken;
