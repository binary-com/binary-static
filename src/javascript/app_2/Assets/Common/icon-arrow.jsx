import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconArrow = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' xmlns='http://www.w3.org/2000/svg'>
        <path
            className={classNames(classNamePath, 'color1-fill')}
            fill='#000'
            fillOpacity='.8'
            fillRule='evenodd'
            d='M8 6.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6a1 1 0 0 1 1.414 0l6 6a1 1 0 1 1-1.414 1.414L8 6.414z'
        />
    </svg>
);

IconArrow.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export { IconArrow };
