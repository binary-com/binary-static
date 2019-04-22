import React   from 'react';
import Tooltip from 'App/Components/Elements/Tooltip2/tooltip.jsx';

class TooltipWrapper extends React.Component {
    state = {
        should_show_tooltip: false,
    }

    constructor(props) {
        super(props);
        this.item_reference = React.createRef();
        this.item_coordinates = {
            x     : 0,
            y     : 0,
            top   : 0,
            left  : 0,
            bottom: 0,
            right : 0,
            width : 0,
            height: 0,
        };
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

    render() {
        const {
            alignment,
            children,
            message,
        } = this.props;
        return (
            <React.Fragment>
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    ref={this.item_reference}
                >
                    { children }
                </div>

                <Tooltip
                    alignment={alignment}
                    message={message}
                    should_show_tooltip={this.state.should_show_tooltip}
                    element_coordinates={this.item_coordinates}
                />
            </React.Fragment>
        );
    }
}

export default TooltipWrapper;
