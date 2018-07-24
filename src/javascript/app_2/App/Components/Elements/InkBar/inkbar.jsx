import PropTypes from 'prop-types';
import React     from 'react';

const InkBar = ({ left, width }) => {
    const inkbar_style = {
        left,
        width,
    };
    return (
        <span style={inkbar_style} className='inkbar' />
    );
};

InkBar.propTypes = {
    left : PropTypes.number,
    width: PropTypes.number,
};

export default InkBar;