import React         from 'react';
import TooltipBubble from './tooltip-bubble.jsx';

class Tooltip2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { should_show_tooltip_bubble: false };
        this.tooltip_trigger_reference = React.createRef();
    }

    onMouseEnter = () => {
        this.setState({ should_show_tooltip_bubble: true });
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
                className='tooltip-2'
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    ref={this.tooltip_trigger_reference}
                    className='tooltip-2__trigger'
                >
                    { children }
                </div>

                { this.state.should_show_tooltip_bubble &&
                    <TooltipBubble
                        className='tooltip-2__bubble'
                        alignment={alignment}
                        message={message}
                        tooltip_trigger_rect={this.tooltip_trigger_reference.current.getBoundingClientRect()}
                    />
                }
            </div>
        );
    }
}

export default Tooltip2;
