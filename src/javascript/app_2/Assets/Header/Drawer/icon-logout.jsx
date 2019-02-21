import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconLogout = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
        <g className='color1-fill' fill='#2A3052' fillRule='nonzero'>
            <path d='M8.4 13.8c0 .8-.4 1.4-.9 1.4H2c-.5 0-1-.6-1-1.4V2.4C1 1.6 1.5 1 2 1h5.6c.5 0 .9.6.9 1.4 0 .2.1.4.4.4.2 0 .3-.2.3-.4C9.1 1.2 8.4.2 7.5.2H2C.9.2.2 1.2.2 2.4v11.4C.2 15 1 16 2 16h5.6c1 0 1.6-1 1.6-2.2 0-.2-.1-.4-.3-.4-.3 0-.4.2-.4.4z' />
            <path d='M4.8 8.5h10.4c.2 0 .4-.2.4-.4s-.2-.4-.4-.4H4.8c-.2 0-.3.2-.3.4s.1.4.3.4z' />
            <path d='M11.3 4.4l3.8 4h.6v-.6l-4-4a.4.4 0 0 0-.4 0c-.2.2-.2.4 0 .6z' />
            <path d='M11.8 12.4l3.9-4v-.6a.4.4 0 0 0-.6 0l-3.8 4c-.2.2-.2.4 0 .6.1.2.3.2.5 0z' />
        </g>
    </svg>
);

IconLogout.propTypes = {
    className: PropTypes.string,
};

export { IconLogout };
