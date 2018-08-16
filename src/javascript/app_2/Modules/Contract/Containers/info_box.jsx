import { CSSTransition }   from 'react-transition-group';
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
    is_contract_mode,
    contract_info,
    digits_info,
    is_trade_page,
}) => {
    const is_digit = isDigitContract(contract_info.contract_type);
    const is_ended = isEnded(contract_info);

    let Contents = is_ended ? InfoBoxExpired : InfoBoxGeneral;
    if (is_digit && is_trade_page) { // we don't display digit info in Statement/Portfolio because of API shortages
        Contents = InfoBoxDigit;
    }

    return (
        <CSSTransition
            in={is_contract_mode}
            timeout={200}
            classNames='info-box-container'
            unmountOnExit
        >
            <div className='info-box-container'>
                <div className='info-box'>
                    { contract_info.contract_type &&
                        <Contents
                            contract_info={contract_info}
                            digits_info={digits_info}
                            is_ended={is_ended}
                        />
                    }
                </div>
            </div>
        </CSSTransition>
    );
};

InfoBox.propTypes = {
    contract_info   : PropTypes.object,
    digits_info     : PropTypes.object,
    is_contract_mode: PropTypes.bool,
    is_trade_page   : PropTypes.bool,
};

export default connect(
    ({ modules }) => ({
        is_contract_mode: modules.smart_chart.is_contract_mode,
        contract_info   : modules.contract.contract_info,
        digits_info     : modules.contract.digits_info,
    })
)(InfoBox);
