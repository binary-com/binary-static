import PropTypes            from 'prop-types';
import React, { Component } from 'react';

class ContractCardFooter extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className='contract-card__footer'>
                {children}
            </div>
        );
    }
}

ContractCardFooter.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
};

export default ContractCardFooter;
