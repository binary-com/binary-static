import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ReactDOM            from 'react-dom';

const DropdownTooltip = ({
    alignment,
    className,
    message,
    should_show_tooltip,
    coordinate_x,
    coordinate_y,
}) => {
    const tooltip = (
        <span
            style={{ left: coordinate_x, top: coordinate_y }}
            className={
                classNames(
                    className,
                    { 'list__item-tooltip--show': should_show_tooltip }
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
