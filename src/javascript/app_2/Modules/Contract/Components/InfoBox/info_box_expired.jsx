import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Money        from '../../../../App/Components/Elements/money.jsx';
import IconFlag     from '../../../../Assets/Contract/icon_flag.jsx';
import { localize } from '../../../../../_common/localize';

const InfoBoxExpired = ({
    contract_info,
    has_flag = true,
    has_percentage = true,
}) => {
    const {
        currency,
        profit,
        profit_percentage,
    } = contract_info;

    const percentage_text = `${profit_percentage > 0 ? '+' : ''}${profit_percentage}%`;

    return (
        <div className={`expired ${profit > 0 ? 'won' : 'lost'}`}>
            { has_flag &&
                <IconFlag/>
            }
            <div>
                <div>{localize('Profit/Loss')}:</div>
                <div className='pl-value'>
                    <Money amount={profit} currency={currency} has_sign />
                    { has_percentage &&
                        <span className='percentage'>({percentage_text})</span>
                    }
                </div>
            </div>
        </div>
    );
};

InfoBoxExpired.propTypes = {
    contract_info : PropTypes.object,
    has_flag      : PropTypes.bool,
    has_percentage: PropTypes.bool,
};

export default observer(InfoBoxExpired);
