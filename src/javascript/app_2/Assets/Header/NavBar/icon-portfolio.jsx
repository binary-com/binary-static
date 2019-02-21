import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='14' viewBox='0 0 16 14'>
        <g fill='none' fillRule='evenodd'>
            <path fill='#000' fillOpacity='0.16' d='M5 2v-.5A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5V2h3.5A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2H5zm1 0h4v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V2z' />
            <path fill='#FFF' fillRule='nonzero' d='M1 8.128l2.804 1.557A2.5 2.5 0 0 0 5.018 10h5.964a2.5 2.5 0 0 0 1.214-.315L15 8.128V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V8.128zm0-1.144V3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v3.484L11.71 8.81a1.5 1.5 0 0 1-.728.189H5.018a1.5 1.5 0 0 1-.728-.189L1 6.984zM6.5 8h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0 0 1z' />
        </g>
    </svg>
);

IconPortfolio.propTypes = {
    className: PropTypes.string,
};

export { IconPortfolio };
