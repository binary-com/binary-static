import { observer }     from 'mobx-react';
import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import Money            from '../../../../App/Components/Elements/money.jsx';
import Tooltip          from '../../../../App/Components/Elements/tooltip.jsx';
import Button           from '../../../../App/Components/Form/button.jsx';
import RemainingTime    from '../../../../App/Containers/remaining_time.jsx';
import {
    getIndicativePrice,
    isStarted,
    isValidToSell }     from '../../../../Stores/Modules/Contract/Helpers/logic';
import { localize }     from '../../../../../_common/localize';

const InfoBoxGeneral = ({ className, contract_info}) => {
    const {
        buy_price,
        currency,
        date_expiry,
        profit,
    } = contract_info;

    const indicative_price = getIndicativePrice(contract_info);
    const is_started       = isStarted(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);

    const sell_message = is_valid_to_sell
        ? localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.')
        : contract_info.validation_error;

    return (
        <div className={classNames('general', className)}>
            <div>
                <div>{localize('Purchase Price')}</div>
                <div>{localize('Indicative Price')}</div>
                <div>{localize('Profit/Loss')}</div>
            </div>
            <div className='values'>
                <div>
                    <Money amount={buy_price} currency={currency} />
                </div>
                <div>
                    <Money amount={indicative_price} currency={currency} />
                </div>
                <div className={profit >= 0 ? 'profit' : 'loss'}>
                    <Money amount={profit} currency={currency} has_sign />
                </div>
            </div>
            <div>
                <div>{localize('Remaining Time')}</div>
                <strong>
                    { is_started && date_expiry ?
                        <RemainingTime end_time={date_expiry}/>
                        :
                        '-'
                    }
                </strong>
            </div>
            <div className='sell'>
                <Tooltip alignment='left' icon='question' message={sell_message} />
                <Button className='secondary green' text={localize('Sell')} is_disabled={!is_valid_to_sell} />
            </div>
        </div>
    );
};

InfoBoxGeneral.propTypes = {
    className    : PropTypes.string,
    contract_info: PropTypes.object,
};

export default observer(InfoBoxGeneral);
