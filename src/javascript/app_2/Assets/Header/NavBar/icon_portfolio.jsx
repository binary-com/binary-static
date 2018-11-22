import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <g className='color2-fill' fill='none' fillRule='evenodd' stroke='none' strokeWidth='1'>
            <g>
                <path className='color1-stroke color2-fill color3-stroke' fill='none' stroke='#2A3052' d='M1.5 14.5h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-13a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1z' />
                <path className='color1-stroke color3-stroke color4-fill portfolio-fix' stroke='#2A3052' d='M5.5 3v-.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V3' />
                <path className='color1-stroke scale-fix' stroke='#2A3052' strokeLinecap='square' d='M0 8l4.047 2.248a2 2 0 0 0 .971.252h5.964a2 2 0 0 0 .971-.252L16 8' />
                <path className='color1-stroke' stroke='#2A3052' strokeLinecap='round' d='M6.5 8.5h3' />
            </g>
        </g>
    </svg>
);

IconPortfolio.propTypes = {
    className: PropTypes.string,
};

export { IconPortfolio };
