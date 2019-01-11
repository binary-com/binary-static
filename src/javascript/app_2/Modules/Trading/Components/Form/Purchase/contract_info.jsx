import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';

const ContractInfo = ({
    basis,
    contract_title,
    contract_type,
    currency,
    proposal_info,
}) => {
    return (
        <React.Fragment>
            {(proposal_info.has_error || !proposal_info.id) ?
                <div className={proposal_info.has_error ? 'error-info-wrapper' : ''}>
                    <span>{proposal_info.message}</span>
                </div>
                :
                <div className='purchase-info-wrapper'>
                    <div className='info-wrapper'>
                        <div>{localize('Stake')}:</div>
                        <div><Money amount={proposal_info.stake} currency={currency} /></div>
                    </div>
                    <span className='purchase-tooltip'>
                        <Tooltip alignment='left' icon='info' message={proposal_info.message} />
                    </span>
                </div>
            }
        </React.Fragment>
    );
};

ContractInfo.propTypes = {
    barrier_count : PropTypes.number,
    basis         : PropTypes.string,
    contract_title: PropTypes.string,
    contract_type : PropTypes.string,
    currency      : PropTypes.string,
    proposal_info : PropTypes.object,
};

export default ContractInfo;
