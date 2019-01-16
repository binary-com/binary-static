import React, { createContext } from 'react';
import Button from '../../Form/button.jsx';

const context = createContext({});
const { Provider, Consumer } = context;

class Toggle extends React.PureComponent {
    static Button = ({ id, children }) => (
        <Consumer>
            {({ toggle }) => <Button onClick={() => toggle(id)}>{children}</Button>}
        </Consumer>
    );

    static Panel = ({ whenActive, children }) => (
        <Consumer>
            {({ selectedTabId }) => (selectedTabId === whenActive ? children : null)}
        </Consumer>
    )

    state = {
        selectedTabId: 'a',
    }

    toggle = selectedTabId => this.setState({ selectedTabId });

    render() {
        return (
            <Provider value={{ selectedTabId: this.state.selectedTabId, toggle: this.toggle }}>
                {this.props.children}
            </Provider>
        );
    }
}

export { Toggle };
