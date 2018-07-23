import PropTypes    from 'prop-types';
import React        from 'react';
import Money        from '../../../../../App/Components/Elements/money.jsx';
import Tooltip      from '../../../../../App/Components/Elements/tooltip.jsx';
import { localize } from '../../../../../../_common/localize';
import Url          from '../../../../../../_common/url';

const ContractInfo = ({
    barrier_count,
    contract_title,
    contract_type,
    currency,
    proposal_info,
}) => {
    const icon_type = `${contract_type}${/^(call|put)$/i.test(contract_type) && barrier_count > 0 ? '_barrier' : ''}`.toLowerCase();

    return (
        <div className='box'>
            <div className='left-column'>
                <div className='type-wrapper'>
                    <img
                        className='type'
                        src={Url.urlForStatic(`images/app_2/contracts/types/light/ic_${icon_type}.svg`)}
                    />
                </div>
                <h4 className='trade-type'>{contract_title}</h4>
            </div>
            {(proposal_info.has_error || !proposal_info.id) ?
                <div className={proposal_info.has_error ? 'error-info-wrapper' : ''}>
                    <span>{proposal_info.message}</span>
                </div>
                :
                <div className='purchase-info-wrapper'>
                    <div className='stake-wrapper'>
                        <span>
                            {localize('Stake')}:
                            <strong><Money amount={proposal_info.stake} currency={currency} /></strong>
                        </span>
                        <span className='field-info'>
                            <Tooltip alignment='left' icon='info' message={proposal_info.message}/>
                        </span>
                    </div>
                    <div>
                        <span>
                            {localize('Payout')}:
                        </span>
                        <strong><Money amount={proposal_info.payout} currency={currency} /></strong>
                    </div>
                    <div>
                        <span>
                            {localize('Net Profit')}:
                        </span>
                        <strong><Money amount={proposal_info.profit} currency={currency} /></strong>
                    </div>
                    <div>
                        <span>
                            {localize('Return')}:
                        </span>
                        <strong>{proposal_info.returns}</strong>
                    </div>
                </div>
            }
        </div>
    );
};

ContractInfo.propTypes = {
    barrier_count : PropTypes.number,
    contract_title: PropTypes.string,
    contract_type : PropTypes.string,
    currency      : PropTypes.string,
    proposal_info : PropTypes.object,
};

export default ContractInfo;
