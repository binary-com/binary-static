import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

const ContractTypeItem = ({
    name,
    value,
}) => (
    <React.Fragment>
        <h1>{name}</h1>
        <p>{value}</p>
    </React.Fragment>
);

ContractTypeItem.propTypes = {
    name : PropTypes.string,
    value: PropTypes.string,
};

export default ContractTypeItem;
