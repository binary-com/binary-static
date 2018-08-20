import PropTypes           from 'prop-types';
import React               from 'react';
import {
    InfoBoxDigit,
    InfoBoxExpired,
    InfoBoxGeneral }       from '../Components/InfoBox';
import { connect }         from '../../../Stores/connect';
import { isDigitContract } from '../../../Stores/Modules/Contract/Helpers/digits';
import { isEnded }         from '../../../Stores/Modules/Contract/Helpers/logic';

const InfoBox = ({
    contract_info,
    digits_info,
    is_trade_page,
    sell_info,
}) => {
    const is_digit = isDigitContract(contract_info.contract_type);
    const is_ended = isEnded(contract_info);

    let Contents = is_ended ? InfoBoxExpired : InfoBoxGeneral;
    if (is_digit && is_trade_page) { // we don't display digit info in Statement/Portfolio because of API shortages
        Contents = InfoBoxDigit;
    }

    return (
        <div className='info-box'>
            { contract_info.contract_type &&
                <Contents
                    contract_info={contract_info}
                    digits_info={digits_info}
                    is_ended={is_ended}
                    sell_info={sell_info}
                />
            }
        </div>
    );
};

InfoBox.propTypes = {
    contract_info: PropTypes.object,
    digits_info  : PropTypes.object,
    is_trade_page: PropTypes.bool,
    sell_info    : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        contract_info: modules.contract.contract_info,
        digits_info  : modules.contract.digits_info,
        sell_info    : modules.contract.sell_info,
    })
)(InfoBox);
