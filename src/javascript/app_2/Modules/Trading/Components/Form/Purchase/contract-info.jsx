import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';
import { IconPriceMove } from 'Assets/Trading/icon-price-move.jsx';

const ContractInfo = ({
    currency,
    has_increased,
    is_visible,
    proposal_info,
}) => {
    const has_error_or_no_proposal = proposal_info.has_error || !proposal_info.id;
    const is_loading = !proposal_info.has_error && !proposal_info.id;
    const is_loaded = !proposal_info.has_error && proposal_info.id;

    return (
        <React.Fragment>
            {has_error_or_no_proposal &&
                <div
                    className={classNames({
                        'trade-container__error': proposal_info.has_error,
                    })}
                >
                    {proposal_info.message && <span className='trade-container__error-info'>{proposal_info.message}</span>}
                </div>
            }

            {is_loading &&
                <div className='trade-container__loader'>
                    <div className='trade-container__loading--loading' />
                </div>
            }
            {is_loaded &&
                <div className='trade-container__price'>
                    <div className='trade-container__price-info'>
                        <div className='trade-container__price-info-basis'>{localize('[_1]', proposal_info.obj_contract_basis.text)}</div>
                        <div className='trade-container__price-info-value'><Money amount={proposal_info.obj_contract_basis.value} className='trade-container__price-info-currency' currency={currency} /></div>
                        {is_visible &&
                            <div className='trade-container__price-info-movement'>
                                {has_increased !== null && <IconPriceMove type={has_increased ? 'profit' : 'loss'} />}
                            </div>
                        }
                    </div>
                    <span>
                        <Tooltip alignment='left' className='trade-container__price-tooltip' classNameIcon='trade-container__price-tooltip-i' icon='info' message={proposal_info.message} />
                    </span>
                </div>
            }
        </React.Fragment>
    );
};
ContractInfo.propTypes = {
    currency     : PropTypes.string,
    has_increased: PropTypes.bool,
    is_visible   : PropTypes.bool,
    proposal_info: PropTypes.object,
};

export default ContractInfo;
