import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { IconInfoBlue }    from 'Assets/Common/icon-info-blue.jsx';
import { IconInfoOutline } from 'Assets/Common/icon-info-outline.jsx';
import { IconQuestion }    from 'Assets/Common/icon-question.jsx';
import { IconRedDot }      from 'Assets/Common/icon-red-dot.jsx';

class Tooltip extends React.Component {
    state = {
        show_tooltip_balloon_icon: false,
    }

    onMouseEnter = () => {
        this.setState({ show_tooltip_balloon_icon: true });
    }

    onMouseLeave = () => {
        this.setState({ show_tooltip_balloon_icon: false });
    }

    render() {
        const {
            alignment,
            children,
            className,
            icon, // only question or info accepted
            message,
        } = this.props;

        return (
            <span
                className={classNames(className, 'tooltip')}
                data-tooltip={message}
                data-tooltip-pos={alignment}
            >
                {icon === 'info' &&
                    <React.Fragment>
                        <IconInfoOutline
                            className={classNames(`${className}-icon`, 'tooltip__icon')}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        />
                        <IconInfoBlue
                            className={classNames(`${className}-tooltip-balloon-icon`, 'tooltip-balloon-icon', {
                                'tooltip-balloon-icon--show': this.state.show_tooltip_balloon_icon,
                            })}
                        />
                    </React.Fragment>
                }
                {icon === 'question' && <IconQuestion className={classNames(icon, 'tooltip__icon')} />}
                {icon === 'dot'      && <IconRedDot className={classNames(icon, 'tooltip__icon')} />}
                {children}
            </span>
        );
    }
}

Tooltip.propTypes = {
    alignment    : PropTypes.string,
    children     : PropTypes.node,
    className    : PropTypes.string,
    classNameIcon: PropTypes.string,
    icon         : PropTypes.string,
    message      : PropTypes.string,
};

export default Tooltip;
