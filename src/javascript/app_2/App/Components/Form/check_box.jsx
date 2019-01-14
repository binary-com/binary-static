import PropTypes  from 'prop-types';
import React      from 'react';

const Fieldset = ({
    onChange,
    checked,
}) => <input type='checkbox' onChange={onChange} checked={checked} />;

Fieldset.propTypes = {
    checked : PropTypes.bool,
    onChange: PropTypes.func,
};

export default Fieldset;
