import React                     from 'react';
import PropTypes                 from 'prop-types';
import { contract_type_display } from '../../../Constants/contract';
import { localize }              from '../../../../_common/localize';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <i className={`contract-type__icon ${type.toLowerCase()}-icon--light`} />
        {localize(contract_type_display[type])}
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;