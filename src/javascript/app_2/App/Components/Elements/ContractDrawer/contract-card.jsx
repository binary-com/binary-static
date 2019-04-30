import PropTypes            from 'prop-types';
import React, { Component } from 'react';

class ContractCard extends Component {
    render() {
        const { children } = this.props;
        return (
            <div className='contract-card'>
                {children}
            </div>
        );
    }
}

ContractCard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
};

export default ContractCard;
