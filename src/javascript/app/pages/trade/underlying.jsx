import React from 'react';
import ReactDOM from 'react-dom';

class Underlying extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render ({
        ...props,
    }) {
        return (
            <div>Hello World</div>
        );
    }
}

export const init = (underlying, market) => {
    ReactDOM.render(
        <Underlying market={market} underlying={underlying} />,
        document.getElementById('underlying_2')
    );
};
