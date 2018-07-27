import { observer }    from 'mobx-react';
import PropTypes       from 'prop-types';
import React           from 'react';
import { COLOR_CODES } from '../../../../Constants';

const TickIcon = ({
    circle_color = COLOR_CODES.LIGHT_GREEN,
    tick_color   = COLOR_CODES.WHITE,
}) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <circle cx='8' cy='8' r='8' fill={COLOR_CODES[circle_color]} />
            <path fill={COLOR_CODES[tick_color]} fillRule='nonzero' d='M6.5 10.793l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6.5 10.793z' />
        </g>
    </svg>
);

TickIcon.propTypes = {
    circle_color: PropTypes.string,
    tick_color  : PropTypes.string,
};

export default observer(TickIcon);
