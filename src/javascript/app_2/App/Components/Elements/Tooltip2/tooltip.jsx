import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ReactDOM            from 'react-dom';

const Tooltip = ({
    alignment,
    className,
    element_coordinates,
    message,
    should_show_tooltip,
}) => {
    let style;
    switch (alignment) {
        case 'top':
            style = {
                left  : element_coordinates.x,
                bottom: `calc(100% - ${element_coordinates.top}px)`,
            };
            break;
        case 'right':
            style = {
                left: element_coordinates.x + element_coordinates.width,
                top : element_coordinates.y,
            };
            break;
        case 'bottom':
            style = {
                left: element_coordinates.x,
                top : element_coordinates.y + element_coordinates.height,
            };
            break;
        case 'left':
            style = {
                right: `calc(100% - ${element_coordinates.left}px)`,
                top  : element_coordinates.y,
            };
            break;
        default:
            break;
    }

    const tooltip = (
        <span
            style={style}
            className={
                classNames(
                    'tooltip-2',
                    `tooltip-2--${alignment}`,
                    { 'tooltip-2--show': should_show_tooltip },
                    className,
                )}
        >
            <span className={
                classNames(
                    'tooltip-2-arrow',
                    `tooltip-2-arrow--${alignment}`,
                )}
            />
            { message }
        </span>
    );

    return ReactDOM.createPortal(
        tooltip,
        document.getElementById('binary_app'),
    );
};

Tooltip.propTypes = {
    alignment    : PropTypes.string,
    children     : PropTypes.node,
    className    : PropTypes.string,
    classNameIcon: PropTypes.string,
    has_error    : PropTypes.bool,
    icon         : PropTypes.string,
    message      : PropTypes.string,
};

export default Tooltip;
