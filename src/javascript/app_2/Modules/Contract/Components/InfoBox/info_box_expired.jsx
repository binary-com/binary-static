import { observer } from 'mobx-react';
import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import Money        from '../../../../App/Components/Elements/money.jsx';
import IconFlag     from '../../../../Assets/Contract/icon_flag.jsx';
import { localize } from '../../../../../_common/localize';

const InfoBoxExpired = ({ className, contract_info }) => {
    const {
        currency,
        profit,
        profit_percentage,
    } = contract_info;
    const expired_box_class = classNames('expired', `${profit > 0 ? 'won' : 'lost'}`, className);
    const percentage_text = `${profit_percentage > 0 ? '+' : ''}${profit_percentage}%`;

    return (
        <div className={expired_box_class}>
            <IconFlag />
            <div>
                <div>{localize('Profit/Loss')}:</div>
                <div className='pl-value'>
                    <Money amount={profit} currency={currency} has_sign />
                    <span className='percentage'>({percentage_text})</span>
                </div>
            </div>
        </div>
    );
};

InfoBoxExpired.propTypes = {
    className    : PropTypes.string,
    contract_info: PropTypes.object,
};

export default observer(InfoBoxExpired);
