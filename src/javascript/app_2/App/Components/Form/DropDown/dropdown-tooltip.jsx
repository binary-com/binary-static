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
            style = {
                left: element_coordinates.x,
                top : element_coordinates.y - element_coordinates.height - element_coordinates.height - 5,
            };
            break;
        case 'right':
            style = {
                left: element_coordinates.x + element_coordinates.width + 5,
                top : element_coordinates.y - element_coordinates.height - 8,
            };
            break;
        case 'bottom':
            style = {
                left: element_coordinates.x,
                top : element_coordinates.y + 5,
            };
            break;
        case 'left':
            style = {
                right: `calc(100% - ${element_coordinates.x - 5}px)`,
                top  : element_coordinates.y - element_coordinates.height - 8,
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
