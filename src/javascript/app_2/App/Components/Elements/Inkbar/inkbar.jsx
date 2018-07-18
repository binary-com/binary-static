import PropTypes from 'prop-types';
import React     from 'react';

export default function Inkbar({ left, width }) {
    const inkbar_style = {
        left,
        width,
    };
    return (
        <span style={inkbar_style} className='inkbar' />
    );
}

Inkbar.propTypes = {
    left : PropTypes.number,
    width: PropTypes.number,
};