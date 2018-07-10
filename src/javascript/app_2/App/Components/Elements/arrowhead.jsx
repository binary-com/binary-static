import PropTypes from 'prop-types';
import React     from 'react';

const Arrowhead = ({ className }) => (
    <svg className={className} width='16' height='16' xmlns='http://www.w3.org/2000/svg'>
        <path className='arrow-path' d='M13.164 5.13a.5.5 0 1 1 .672.74l-5.5 5a.5.5 0 0 1-.672 0l-5.5-5a.5.5 0 0 1 .672-.74L8 9.824l5.164-4.694z' fill='#D2D3DA' fillRule='nonzero'/>
    </svg>
);

Arrowhead.propTypes = {
    className: PropTypes.string,
};

export default Arrowhead;
