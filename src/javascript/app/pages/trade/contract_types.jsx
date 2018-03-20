import React from 'react';
import ReactDOM from 'react-dom';

class ContractTypes extends React.Component {
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

export const init = (contracts, market) => {
    ReactDOM.render(
        <ContractTypes market={market} contracts={contracts} />,
        document.getElementById('underlying_2')
    );
};
