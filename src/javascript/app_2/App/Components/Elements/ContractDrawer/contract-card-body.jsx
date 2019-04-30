import PropTypes            from 'prop-types';
import React, { Component } from 'react';

class ContractCardBody extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className='contract-card__body'>
                {children}
            </div>
        );
    }
}

ContractCardBody.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default ContractCardBody;
