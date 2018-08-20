import PropTypes           from 'prop-types';
import React               from 'react';
import { Link }            from 'react-router-dom';
import { getContractPath } from '../../../App/Components/Routes/helpers';

const ContractLink = ({
    contract_id,
    text,
}) => {
    const contract_path = getContractPath(contract_id);

    return (
        <Link to={contract_path} onClick={(e) => { e.stopPropagation(); }}>{text}</Link>
    );
};

ContractLink.propTypes = {
    contract_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    text: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ContractLink;
