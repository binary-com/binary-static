import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <g transform='translate(0 3)'>
                <path d='M1 1v10h14V1H1zm0-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z' fill='#2A3052' fillRule='nonzero'/>
                <path d='M3.151 7.5h9.698l2.428-1.62a.5.5 0 0 0 .223-.415V1a.5.5 0 0 0-.5-.5H1a.5.5 0 0 0-.5.5v4.465a.5.5 0 0 0 .223.416L3.15 7.5z' stroke='#2A3052'/>
                <rect fill='#2A3052' x='6' y='5' width='4' height='1' rx='.5'/>
            </g>
            <path d='M5.5 3.5h5V2a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v1.5z' stroke='#2A3052'/>
        </g>
    </svg>
);

IconPortfolio.propTypes = {
    className: PropTypes.string,
};

export { IconPortfolio };
