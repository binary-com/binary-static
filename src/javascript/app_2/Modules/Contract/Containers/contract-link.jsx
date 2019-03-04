import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';

const ContractLink = ({
    children,
    className,
    contract_id,
    onMount,
}) => (
    <a
        className={className}
        href='javascript:;'
        onClick={() => onMount(+contract_id)}
    >
        {children}
    </a>
);

ContractLink.propTypes = {
    children   : PropTypes.node,
    className  : PropTypes.string,
    contract_id: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    onMount: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        onMount: modules.contract.onMount,
    }),
)(ContractLink);
