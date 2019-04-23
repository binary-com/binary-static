import React         from 'react';
import TooltipBubble from './tooltip-bubble.jsx';

class Tooltip2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { should_show_tooltip: false };
        this.item_reference = React.createRef();
        this.item_coordinates = {};
    }

    onMouseEnter = () => {
        this.setState({ should_show_tooltip: true });
        this.item_coordinates = this.item_reference.current.getBoundingClientRect();
    }

    onMouseLeave = () => {
        this.setState({ should_show_tooltip: false });
    }

    createPositionStyle = alignment => {
        switch (alignment) {
            case 'top': return {
                left  : this.item_coordinates.x,
                bottom: `calc(100% - ${this.item_coordinates.top}px)`,
            };
            case 'right': return {
                left: this.item_coordinates.x + this.item_coordinates.width,
                top : this.item_coordinates.y,
            };
            case 'bottom': return {
                left: this.item_coordinates.x,
                top : this.item_coordinates.y + this.item_coordinates.height,
            };
            case 'left': return {
                right: `calc(100% - ${this.item_coordinates.left}px)`,
                top  : this.item_coordinates.y,
            };
            default: return {
                left: this.item_coordinates.x,
                top : this.item_coordinates.y,
            };
        }
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
                    ref={this.item_reference}
                >
                    { children }
                </div>

                { this.state.should_show_tooltip &&
                    <TooltipBubble
                        alignment={alignment}
                        style={this.createPositionStyle(alignment)}
                        message={message}
                    />
                }
            </div>
        );
    }
}

export default Tooltip2;
