import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCashier = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
        <g fill='none' fillRule='evenodd'>
            <path d='M13.5 4.5v7H2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5h-1.5z' stroke='#2A3052'/>
            <path fill='#2A3052' d='M14 6h1v2h-1z'/>
            <g transform='translate(0 2)'>
                <rect stroke='#2A3052' x='.5' y='.5' width='13' height='9' rx='1'/>
                <path fill='#2A3052' d='M1 2h12v2H1z'/>
                <rect fill='#2A3052' x='2' y='5' width='5' height='1' rx='.5'/>
                <rect fill='#2A3052' x='2' y='7' width='3' height='1' rx='.5'/>
                <circle fill='#2A3052' cx='10' cy='6' r='1'/>
            </g>
        </g>
    </svg>
);

IconCashier.propTypes = {
    className: PropTypes.string,
};

export { IconCashier };
