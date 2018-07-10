import PropTypes       from 'prop-types';
import React           from 'react';
import { toGMTFormat } from '../../../../../../Utils/Date';
import { localize }    from '../../../../../../../_common/localize';

const PurchaseResult = ({ purchase_info }) => (
    <div className='info-text'>
        <div><strong>{localize('Purchase Info')}:</strong></div>
        <div>{localize('Buy Price')}: {purchase_info.buy_price}</div>
        <div>{localize('Payout')}: {purchase_info.payout}</div>
        <div>{localize('Start')}: {toGMTFormat(purchase_info.start_time * 1000)}</div>
        <div>{localize('Contract ID')}: {purchase_info.contract_id}</div>
        <div>{localize('Transaction ID')}: {purchase_info.transaction_id}</div>
        <div>{localize('Description')}: {purchase_info.longcode}</div>
    </div>
);

PurchaseResult.propTypes = {
    purchase_info: PropTypes.object,
};

export default PurchaseResult;
