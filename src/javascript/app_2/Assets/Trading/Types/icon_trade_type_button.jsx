import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTradeTypeButton = ({ type, className }) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'call':
                IconType = (
                    <g fill="none" fillRule="evenodd">
                        <path fill="none" d="M0 0h16v16H0z"/>
                        <path d="M0 0h16v16H0z"/>
                        <path fill="#FFF" d="M8.721.162c0 1.13.902 2.03 1.983 2.03h1.848l-7.55 7.731v2.885l8.97-9.185v1.892c0 1.131.901 2.031 1.983 2.031V.138H8.72v.024z"/>
                        <path fill="#F93" d="M.135 12.808v2.123h2.817l2.05-2.123z"/>
                    </g>
                );
                break;
            case 'put':
                IconType = (
                    <g fill="none" fillRule="evenodd">
                        <path fill="none" d="M0 0h16v16H0z"/>
                        <path d="M0 0h16v16H0z"/>
                        <path fill="#FFF" d="M8.631 14.862c0-1.131.901-2.031 1.983-2.031h1.848L4.912 5.1V2.215l8.97 9.185V9.508c0-1.131.901-2.031 1.983-2.031v7.408H8.63v-.023z"/>
                        <path fill="#F93" d="M.045 2.215V.092h2.817l2.05 2.123z"/>
                    </g>
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

IconTradeTypeButton.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export { IconTradeTypeButton };
