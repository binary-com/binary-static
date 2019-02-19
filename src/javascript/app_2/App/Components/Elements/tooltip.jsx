import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import {
    IconInfoBlue,
    IconInfoOutline,
    IconQuestion,
    IconRedDot }  from 'Assets/Common/Tooltip';

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
                className={classNames(className, icon, 'tooltip')}
                data-tooltip={message}
                data-tooltip-pos={alignment}
            >
                {icon === 'info' &&
                    <React.Fragment>
                        <span
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            <IconInfoOutline className='tooltip__icon' />
                        </span>
                        <IconInfoBlue
                            className={classNames('tooltip__balloon__icon', {
                                'tooltip__balloon__icon--show': this.state.show_tooltip_balloon_icon,
                            })}
                        />
                    </React.Fragment>
                }
                {icon === 'question' && <IconQuestion />}
                {icon === 'dot'      && <IconRedDot />}
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
