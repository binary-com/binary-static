import React         from 'react';
import TooltipBubble from './tooltip-bubble.jsx';

class Tooltip2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { should_show_tooltip_bubble: false };
        this.tooltip_trigger_ref = React.createRef();
    }

    onMouseEnter = () => {
        this.setState({ should_show_tooltip_bubble: true });
        this.tooltip_trigger_rect = this.tooltip_trigger_ref.current.getBoundingClientRect();
    }

    onMouseLeave = () => {
        this.setState({ should_show_tooltip_bubble: false });
    }

    render() {
        const {
            alignment,
            children,
            message,
        } = this.props;

        return (
            <div
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    ref={this.tooltip_trigger_ref}
                >
                    { children }
                </div>

                { this.state.should_show_tooltip_bubble &&
                    <TooltipBubble
                        alignment={alignment}
                        message={message}
                        tooltip_trigger_rect={this.tooltip_trigger_rect}
                    />
                }
            </div>
        );
    }
}

export default Tooltip2;
