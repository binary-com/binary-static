import React, { createContext } from 'react';
import Button from '../../Form/button.jsx';

const context = createContext({});
const { Provider, Consumer } = context;

class Toggle extends React.PureComponent {
    static Button = ({ id, children, ...props }) => (
        <Consumer>
            {({ toggle }) => <Button {...props} onClick={() => toggle(id)}>{children}</Button>}
        </Consumer>
    );

    static SimpleToggleButton = ({ children, ...props }) =>  (
        <Consumer>
            {({ simpleToggle }) => <Button {...props} onClick={simpleToggle}>{children}</Button>}
        </Consumer>
    );

    static Panel = ({ whenActive, children }) => (
        <Consumer>
            {({ selectedTabId }) => (selectedTabId === whenActive ? children : null)}
        </Consumer>
    )

    static PanelOn = ({ children }) => (
        <Consumer>
            {({ isActive }) => (isActive ? children : null)}
        </Consumer>
    )

    static PanelOff = ({ children }) => (
        <Consumer>
            {({ isActive }) => (isActive ? null : children)}
        </Consumer>
    )

    state = {
        selectedTabId: 'a',
        isActive     : false,
    }

    toggle = selectedTabId => this.setState({ selectedTabId });

    simpleToggle = () => this.setState({ isActive: !this.state.isActive })

    render() {
        return (
            <Provider value={{
                isActive     : this.state.isActive,
                selectedTabId: this.state.selectedTabId,
                toggle       : this.toggle,
                simpleToggle : this.simpleToggle,
            }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export { Toggle };
