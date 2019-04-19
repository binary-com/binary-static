import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ReactDOM            from 'react-dom';

const DropdownTooltip = ({
    alignment,
    className,
    element_coordinates,
    message,
    should_show_tooltip,
}) => {
    let style;
    switch (alignment) {
        case 'top':
            element_coordinates.y -= 25;
            break;
        case 'right':
            element_coordinates.x += 25;
            break;
        case 'bottom':
            element_coordinates.y += 25;
            break;
        case 'left':
            style = {
                right: `calc(100% - ${element_coordinates.x - 5}px)`,
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
                    className,
                    { 'list__item-tooltip--show': should_show_tooltip },
                )}
        >
            { message }
        </span>
    );

    return ReactDOM.createPortal(
        tooltip,
        document.getElementById('app_contents'),
    );
};

DropdownTooltip.propTypes = {
    alignment    : PropTypes.string,
    children     : PropTypes.node,
    className    : PropTypes.string,
    classNameIcon: PropTypes.string,
    has_error    : PropTypes.bool,
    icon         : PropTypes.string,
    message      : PropTypes.string,
};

export default DropdownTooltip;
