import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ReactDOM            from 'react-dom';
import { Icon }            from 'Assets/Common/icon.jsx';
import { IconInfoBlue }    from 'Assets/Common/icon-info-blue.jsx';
import { IconInfoOutline } from 'Assets/Common/icon-info-outline.jsx';
import { IconQuestion }    from 'Assets/Common/icon-question.jsx';
import { IconRedDot }      from 'Assets/Common/icon-red-dot.jsx';

const DropdownTooltip = (
    alignment,
    className,
    classNameIcon,
    has_error,
    icon, // only question or info accepted
    message,
    should_show_tooltip,
) => {
    const icon_class = classNames(classNameIcon, icon);
    const tooltip = (
        <span
            className={classNames(
                'list__item-tooltip',
                'tooltip')
            }
        >
            {icon === 'info' &&
                <React.Fragment>
                    <Icon
                        icon={IconInfoOutline}
                        className={icon_class}
                    />
                    <Icon
                        icon={IconInfoBlue}
                        className={classNames(
                            `${classNameIcon}-balloon-icon`,
                            'tooltip__balloon-icon',
                            { 'tooltip__balloon-icon--show': should_show_tooltip }
                        )}
                    />
                </React.Fragment>
            }
            {icon === 'question' && <Icon icon={IconQuestion} className={icon_class} />}
            {icon === 'dot'      && <Icon icon={IconRedDot} className={icon_class} />}
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
