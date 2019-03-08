import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';

const ContractLink = ({
    chart_config,
    children,
    className,
    openContract,
}) => (
    <a
        className={className}
        href='javascript:;'
        onClick={() => openContract(chart_config)}
    >
        {children}
    </a>
);

ContractLink.propTypes = {
    chart_config: PropTypes.object,
    children    : PropTypes.node,
    className   : PropTypes.string,
    contract_id : PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    onMount: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        openContract: modules.contract.onLoadContract,
    }),
)(ContractLink);
