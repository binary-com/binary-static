import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconQuickPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'>
        <path className='color1-fill color3-fill' fill='#2A3052' fillRule='evenodd' d='M1 0h14c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H1a1 1 0 0 1-1-1V1c0-.6.4-1 1-1zm0 1v10h5V1H1zm6 0v10h8V1H7zm1.5 1.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1z' />
    </svg>
);

IconQuickPortfolio.propTypes = {
    className: PropTypes.string,
};

export { IconQuickPortfolio };
