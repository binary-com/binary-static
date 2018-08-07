import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconStatement = ({ className, stroke_color = '#2A3052', fill_color = 'none' }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
        <g fill={fill_color} fillRule='evenodd'>
            <g className='stroke-only' stroke={stroke_color}>
                <path className='no-fill' d='M12.5 15.5V4.207L8.79.5H1a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h11.5zM12.5 6.5v9H14a1.5 1.5 0 0 0 1.5-1.5V7a.5.5 0 0 0-.5-.5h-2.5z'/>
            </g>
            <path className='fill-only' d='M3.5 5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1z' fill={stroke_color}/>
        </g>
    </svg>
);

IconStatement.propTypes = {
    className: PropTypes.string,
};

export { IconStatement };
