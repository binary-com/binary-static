import PropTypes            from 'prop-types';
import React, { Component } from 'react';

class ContractCardHeader extends Component {
    render() {
        const { children } = this.props;
        return (
            <div className='contract-card__header'>
                {children}
            </div>
        );
    }
}

ContractCardHeader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default ContractCardHeader;
