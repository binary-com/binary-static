import React      from 'react';
import ReactDOM   from 'react-dom';
import classNames from 'classnames';

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

    createTooltipBubble = (
        alignment,
        style,
        should_show_tooltip,
        message
    ) => (
        <span
            style={style}
            className={classNames(
                'tooltip-2',
                `tooltip-2--${alignment}`,
            )}
        >
            <span className={classNames(
                'tooltip-2-arrow',
                `tooltip-2-arrow--${alignment}`,
            )}
            />
            { message }
        </span>
    );

    render() {
        const {
            alignment,
            children,
            message,
        } = this.props;

        const tooltip_bubble = ReactDOM.createPortal(
            this.createTooltipBubble(
                alignment,
                this.createPositionStyle(alignment),
                this.state.should_show_tooltip,
                message
            ),
            document.getElementById('binary_app'),
        );

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
                    tooltip_bubble
                }
            </div>
        );
    }
}

export default Tooltip2;
