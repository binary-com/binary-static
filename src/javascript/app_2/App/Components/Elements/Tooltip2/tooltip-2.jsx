import React         from 'react';
import TooltipBubble from './tooltip-bubble.jsx';

class Tooltip2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
        this.tooltip_trigger_reference = React.createRef();
    }

    onMouseEnter = () => {
        this.setState({ is_open: true });
    }

    onMouseLeave = () => {
        this.setState({ is_open: false });
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
                { this.state.is_open &&
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
