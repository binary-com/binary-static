import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';
import { IconPriceMove } from 'Assets/Trading/icon_price_move.jsx';

const ContractInfo = ({
    currency,
    has_increased,
    proposal_info,
}) => (
    <React.Fragment>
        {(proposal_info.has_error || !proposal_info.id) ?
            <div className={proposal_info.has_error ? 'error-info-wrapper' : ''}>
                <span>{proposal_info.message}</span>
            </div>
            :
            <div className='purchase-info-wrapper'>
                <div className='info-wrapper'>
                    <div>{localize('[_1]', proposal_info.obj_contract_basis.text)}</div>
                    <div className='info-wrapper__amount'><Money amount={proposal_info.obj_contract_basis.value} currency={currency} /></div>
                    <div className='icon_price_move_container'>
                        {has_increased !== null && <IconPriceMove type={has_increased ? 'profit' : 'loss'} />}
                    </div>
                </div>
                <span className='purchase-tooltip'>
                    <Tooltip alignment='left' icon='info' message={proposal_info.message} />
                </span>
            </div>
        }
    </React.Fragment>
);

ContractInfo.propTypes = {
    currency     : PropTypes.string,
    has_increased: PropTypes.bool,
    proposal_info: PropTypes.object,
};

export default ContractInfo;
