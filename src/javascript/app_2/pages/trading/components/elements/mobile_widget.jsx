import React from 'react';

class MobileWidget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    render() {
        const props_to_pass = {
            [this.state.open ? 'is_nativepicker' : 'is_minimized']: true,
        };

        const children_with_props = React.Children.map(this.props.children, child => 
            React.cloneElement(child, props_to_pass));

        return null;
    }
}

export default MobileWidget;