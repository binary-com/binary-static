import PropTypes         from 'prop-types';
import React             from 'react';
import classNames        from 'classnames';

const IconPositions = ({ className, type }) => {
    let IconType;
    switch (type) {
        case 'active':
            IconType = (
                <g fill='none' fillRule='evenodd'>
                    <path fill='#2A3052' fillRule='evenodd' d='M1 2h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v10h8V3H1zm9 0v10h5V3h-5zM2.5 4.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm-2 2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z' />
                </g>
            );
            break;
        default:
            IconType = (
                <g fill='none' fillRule='evenodd'>
                    <path fill='#000' fillOpacity='.8' fillRule='evenodd' d='M1 2h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v10h2V3H1zm3 0v10h11V3H4z' />
                </g>
            );
            break;
    }

    return (
        <div>
            <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                {IconType}
            </svg>
        </div>
    );
};

IconPositions.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export { IconPositions };