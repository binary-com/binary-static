import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';
import { IconPriceMove } from 'Assets/Trading/icon-price-move.jsx';

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    is_loading,
    is_visible,
    proposal_info,
}) => {
    const is_loaded_with_error = proposal_info.has_error || !proposal_info.id;

    return (
        <React.Fragment>
            {is_loading ?
                <div className='trade-container__loader'>
                    <div className='trade-container__loader--loading' />
                </div>
                :
                <div className='trade-container__price'>
                    <div className={classNames('trade-container__price-info', { 'trade-container__price-info--disabled': is_loaded_with_error })}>
                        <div className='trade-container__price-info-basis'>{is_loaded_with_error ? basis : localize('[_1]', proposal_info.obj_contract_basis.text)}</div>
                        <div className='trade-container__price-info-value'>
                            {is_loaded_with_error ?
                                ''
                                :
                                <Money amount={proposal_info.obj_contract_basis.value} className='trade-container__price-info-currency' currency={currency} />
                            }
                        </div>
                        {is_visible &&
                        <div className='trade-container__price-info-movement'>
                            {!is_loaded_with_error && has_increased !== null && <IconPriceMove type={has_increased ? 'profit' : 'loss'} />}
                        </div>
                        }
                    </div>
                    <span>
                        <Tooltip
                            alignment='left'
                            className={classNames('trade-container__price-tooltip', { 'trade-container__price-tooltip--disabled': is_loaded_with_error })}
                            classNameIcon='trade-container__price-tooltip-i'
                            icon='info'
                            message={is_loaded_with_error ? '' : proposal_info.message}
                        />
                    </span>
                </div>
            }
        </React.Fragment>
    );
};
ContractInfo.propTypes = {
    basis        : PropTypes.string,
    currency     : PropTypes.string,
    has_increased: PropTypes.bool,
    is_loading   : PropTypes.bool,
    is_visible   : PropTypes.bool,
    proposal_info: PropTypes.object,
};

export default ContractInfo;
