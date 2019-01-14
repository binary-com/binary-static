import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTradeType = ({ type, className }) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'call':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path fill='none' d='M0 0h16v16H0z' />
                        <path d='M0 0h16v16H0z' />
                        <path fill='#FFF' d='M8.721.162c0 1.13.902 2.03 1.983 2.03h1.848l-7.55 7.731v2.885l8.97-9.185v1.892c0 1.131.901 2.031 1.983 2.031V.138H8.72v.024z' />
                        <path fill='#F93' d='M.135 12.808v2.123h2.817l2.05-2.123z' />
                    </g>
                );
                break;
            case 'put':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path fill='none' d='M0 0h16v16H0z' />
                        <path d='M0 0h16v16H0z' />
                        <path fill='#FFF' d='M8.631 14.862c0-1.131.901-2.031 1.983-2.031h1.848L4.912 5.1V2.215l8.97 9.185V9.508c0-1.131.901-2.031 1.983-2.031v7.408H8.63v-.023z' />
                        <path fill='#F93' d='M.045 2.215V.092h2.817l2.05 2.123z' />
                    </g>
                );
                break;
            default:
                IconType = (
                    <path fill='#B0B3BF' fillRule='evenodd' d='M7 10.4L7.4 9 8 7.9l1-1c.4-.5.6-1 .6-1.5 0-.6-.1-1-.4-1.3-.2-.3-.6-.4-1.2-.4-.5 0-.9.1-1.2.4-.3.3-.4.6-.4 1H5c0-.7.3-1.4.9-1.9.5-.5 1.2-.7 2.1-.7 1 0 1.7.3 2.2.8.5.5.8 1.1.8 2 0 .9-.4 1.7-1.2 2.6l-.8.8c-.4.4-.5 1-.5 1.7H7zm0 2.3c0-.2 0-.4.2-.5l.6-.3c.3 0 .5.1.6.3.2.1.2.3.2.5 0 .3 0 .4-.2.6l-.6.2c-.2 0-.4 0-.6-.2a.8.8 0 0 1-.2-.6z' />
                );
                break;
        }
    }
    return (
        <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
            {IconType}
        </svg>

    );
};

IconTradeType.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export { IconTradeType };
