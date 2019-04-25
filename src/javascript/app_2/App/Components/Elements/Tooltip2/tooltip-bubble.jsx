import React               from 'react';
import ReactDOM            from 'react-dom';
import classNames          from 'classnames';
import posed, { PoseGroup } from 'react-pose';
import { Icon }            from 'Assets/Common/icon.jsx';
import { IconInfoBlue }    from 'Assets/Common/icon-info-blue.jsx';
import { IconQuestion }    from 'Assets/Common/icon-question.jsx';
import { IconRedDot }      from 'Assets/Common/icon-red-dot.jsx';

const FadeIn = posed.div({
    enter: {
        opacity: 1,

        transition: {
            duration: 300,
        },
    },
    exit: {
        opacity: 0,

        transition: {
            duration: 300,
        },
    },
});

class TooltipBubble extends React.PureComponent {
    getBubblePositionStyle = (alignment, tooltip_trigger_rectangle) => {
        switch (alignment) {
            case 'top': return {
                left     : tooltip_trigger_rectangle.left + (tooltip_trigger_rectangle.width / 2),
                transform: 'translateX(-50%)',
                bottom   : `calc(100% - ${tooltip_trigger_rectangle.top}px)`,
            };
            case 'right': return {
                left: tooltip_trigger_rectangle.x + tooltip_trigger_rectangle.width,
                top : tooltip_trigger_rectangle.y,
            };
            case 'bottom': return {
                left     : tooltip_trigger_rectangle.left + (tooltip_trigger_rectangle.width / 2),
                transform: 'translateX(-50%)',
                top      : tooltip_trigger_rectangle.y + tooltip_trigger_rectangle.height,
            };
            case 'left': return {
                right: `calc(100% - ${tooltip_trigger_rectangle.left}px)`,
                top  : tooltip_trigger_rectangle.y,
            };
            default: return {
                left: tooltip_trigger_rectangle.x,
                top : tooltip_trigger_rectangle.y,
            };
        }
    }

    render() {
        const {
            alignment,
            icon,
            message,
            tooltip_trigger_rectangle,
        } = this.props;
    
        return ReactDOM.createPortal(
            <PoseGroup>
                <FadeIn key='fade_in' initialPose='exit'>
                    <span
                        style={this.getBubblePositionStyle(
                            alignment,
                            tooltip_trigger_rectangle,
                        )}
                        className={classNames(
                            'tooltip-2__bubble',
                            `tooltip-2__bubble--${alignment}`,
                        )}
                    >
                        <span className={classNames(
                            'tooltip-2__bubble__arrow',
                            `tooltip-2__bubble__arrow--${alignment}`,
                        )}
                        />
                        { icon &&
                            <span className='tooltip-2__bubble__icon'>
                                {icon === 'info'     && <Icon icon={IconInfoBlue} />}
                                {icon === 'question' && <Icon icon={IconQuestion} />}
                                {icon === 'dot'      && <Icon icon={IconRedDot} />}
                            </span>
                        }
                        { message }
                    </span>
                </FadeIn>
            </PoseGroup>,
            document.getElementById('binary_app')
        );
    }
}

export default TooltipBubble;
