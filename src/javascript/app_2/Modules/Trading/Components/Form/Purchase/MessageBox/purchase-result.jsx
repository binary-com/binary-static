import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import { toGMTFormat } from 'Utils/Date';

const PurchaseResult = ({ currency, purchase_info }) => (
    <div className='purchase-container__error-result'>
        <div>
            <strong className='purchase-container__error-result-header'>{localize('Purchase Info')}</strong>
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Buy Price')}:</span>
            <span>
                <i className={classNames('purchase-container__error-result-currency', 'symbols', currency.toLowerCase())} />
                {purchase_info.buy_price}
            </span>
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Payout')}:</span>
            <span>
                <i className={classNames('purchase-container__error-result-currency', 'symbols', currency.toLowerCase())} />
                {purchase_info.payout}
            </span>
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Start')}:</span> {toGMTFormat(purchase_info.start_time * 1000)}
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Contract ID')}:</span> {purchase_info.contract_id}
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Transaction ID')}:</span> {purchase_info.transaction_id}
        </div>
        <div>
            <span className='purchase-container__error-result-label'>{localize('Description')}:</span> {purchase_info.longcode}
        </div>
    </div>
);

PurchaseResult.propTypes = {
    currency     : PropTypes.string,
    purchase_info: PropTypes.object,
};

export default PurchaseResult;
