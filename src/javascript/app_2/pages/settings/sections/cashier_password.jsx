import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Section from '../components/section.jsx';

class CashierPassword extends PureComponent {
    render() {
        const { title, description } = this.props;
        return (
            <Section title={title} description={description}>
                {/* content here */}
            </Section>
        );
    }
}

CashierPassword.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
};

export default CashierPassword;