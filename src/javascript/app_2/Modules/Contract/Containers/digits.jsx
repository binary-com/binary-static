import PropTypes               from 'prop-types';
import React                   from 'react';
import { connect }             from 'Stores/connect';
import { isDigitContract }     from 'Stores/Modules/Contract/Helpers/digits';
import { isEnded }             from 'Stores/Modules/Contract/Helpers/logic';
import { LastDigitPrediction } from '../Components/LastDigitPrediction';

const Digits = ({
    contract_info,
    digits_info,
    display_status,
    is_trade_page,
}) => {
    const { barrier, contract_type } = contract_info;
    const is_digit = isDigitContract(contract_type);
    const is_ended = isEnded(contract_info);

    return (
        <React.Fragment>
            { contract_type && is_digit &&
                <LastDigitPrediction
                    barrier={+barrier}
                    contract_type={contract_type}
                    digits_info={digits_info}
                    is_ended={is_ended}
                    is_trade_page={is_trade_page}
                    status={display_status}
                />
            }
        </React.Fragment>
    );
};

Digits.propTypes = {
    contract_info : PropTypes.object,
    digits_info   : PropTypes.object,
    display_status: PropTypes.string,
};

export default connect(
    ({ modules }) => ({
        contract_info : modules.contract.contract_info,
        digits_info   : modules.contract.digits_info,
        display_status: modules.contract.display_status,
    })
)(Digits);
