import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Section from '../components/section.jsx';

class ApiToken extends PureComponent {
    render() {
        const { title, description } = this.props;
        return (
            <Section title={title} description={description}>
                {/* content here */}
            </Section>
        );
    }
}

ApiToken.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default ApiToken;