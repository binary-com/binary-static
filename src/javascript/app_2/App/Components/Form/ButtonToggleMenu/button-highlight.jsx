import PropTypes from 'prop-types';
import React     from 'react';

const Highlight = ({ left, width }) => {
    const highlight_style = {
        width,
        transform                : `translate3d(${left}px, 0, 0)`,
        'borderTopLeftRadius'    : (left === 0) ? '4px' : '0',
        'borderTopRightRadius'   : (left === 0) ? '0' : '4px',
        'borderBottomLeftRadius' : (left === 0) ? '4px' : '0',
        'borderBottomRightRadius': (left === 0) ? '0' : '4px',
    };

    return (
        <span style={highlight_style} className='button-menu--highlight' />
    );
};

Highlight.propTypes = {
    left : PropTypes.number,
    width: PropTypes.number,
};

export { Highlight };
