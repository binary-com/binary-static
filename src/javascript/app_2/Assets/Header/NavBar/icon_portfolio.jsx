import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
        <path fill='#2A3052' fillRule='evenodd' d='M5 3V2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1h4c.6 0 1 .4 1 1v4l-2.7 1.8a1 1 0 0 1-.6.2H3.3a1 1 0 0 1-.6-.2L0 8V4c0-.6.4-1 1-1h4zm1 0h4V2H6v1zM0 9l2.7 1.8.6.2h9.4c.2 0 .4 0 .6-.2L16 9v5c0 .6-.4 1-1 1H1a1 1 0 0 1-1-1V9zm6.5-1a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z'/>
    </svg>

);

IconPortfolio.propTypes = {
    className: PropTypes.string,
};

export { IconPortfolio };
