import React from 'react';
import { connect } from '../store/connect';

const ContractType = ({
    contract_type,
    contract_type_list,
    categories,
    onChange,
}) =>  (
    <fieldset>
        <select name='contract_type' value={contract_type} onChange={onChange}>
            {Object.keys(contract_type_list).map((option, idx) => {
                if (contract_type_list[option].length) {
                    return contract_type_list[option].map((sub_option, idx_sub) => (
                        <React.Fragment key={idx_sub}>
                            {idx_sub === 0 && <optgroup label={categories[option]} />}
                            <option value={sub_option}>{categories[sub_option]}</option>
                        </React.Fragment>
                    ));
                }
                return (
                    <option key={idx} value={option}>{categories[option]}</option>
                );
            })}
        </select>
    </fieldset>
);

export default connect(
    ({trade}) => ({
        contract_type     : trade.contract_type,
        contract_type_list: trade.contract_type_list,
        categories        : trade.categories,
        onChange          : trade.handleChange,
    })
)(ContractType);
