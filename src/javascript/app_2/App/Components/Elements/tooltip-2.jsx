import React      from 'react';
import ReactDOM   from 'react-dom';
import classNames from 'classnames';

class Tooltip2 extends React.Component {
    state = {
        should_show_tooltip: false,
    }

    constructor(props) {
        super(props);
        this.item_reference = React.createRef();
        this.item_coordinates = {};
    }

    onMouseEnter = () => {
        this.setState({
            should_show_tooltip: true,
        });
        this.item_coordinates = this.item_reference.current.getBoundingClientRect();
    }

    onMouseLeave = () => {
        this.setState({
            should_show_tooltip: false,
        });
    }

    createPositionStyle = alignment => {
        let style;
        switch (alignment) {
            case 'top':
                style = {
                    left  : this.item_coordinates.x,
                    bottom: `calc(100% - ${this.item_coordinates.top}px)`,
                };
                break;
            case 'right':
                style = {
                    left: this.item_coordinates.x + this.item_coordinates.width,
                    top : this.item_coordinates.y,
                };
                break;
            case 'bottom':
                style = {
                    left: this.item_coordinates.x,
                    top : this.item_coordinates.y + this.item_coordinates.height,
                };
                break;
            case 'left':
                style = {
                    right: `calc(100% - ${this.item_coordinates.left}px)`,
                    top  : this.item_coordinates.y,
                };
                break;
            default:
                break;
        }

        return style;
    }

    createTooltipElement = (
        alignment,
        style,
        should_show_tooltip,
        message
    ) => (
        <span
            style={style}
            className={
                classNames(
                    'tooltip-2',
                    `tooltip-2--${alignment}`,
                    { 'tooltip-2--show': should_show_tooltip },
                )}
        >
            <span className={
                classNames(
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

        const tooltip = ReactDOM.createPortal(
            this.createTooltipElement(alignment,
                this.createPositionStyle(alignment),
                this.state.should_show_tooltip,
                message),
            document.getElementById('binary_app'),
        );

        return (
            <React.Fragment>
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    ref={this.item_reference}
                >
                    { children }
                </div>

                { tooltip }
            </React.Fragment>
        );
    }
}

export default Tooltip2;
