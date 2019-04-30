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
    const has_error_or_not_loaded = proposal_info.has_error || !proposal_info.id;

    return (
        <React.Fragment>
            {is_loading ?
                <div className='trade-container__loader'>
                    <div className='trade-container__loader--loading' />
                </div>
                :
                <div className='trade-container__price'>
                    <div className={classNames('trade-container__price-info', { 'trade-container__price-info--disabled': has_error_or_not_loaded })}>
                        <div className='trade-container__price-info-basis'>
                            {has_error_or_not_loaded
                                ? basis
                                : localize('[_1]', proposal_info.obj_contract_basis.text)
                            }
                        </div>
                        <div className='trade-container__price-info-value'>
                            {!has_error_or_not_loaded &&
                            <Money amount={proposal_info.obj_contract_basis.value} className='trade-container__price-info-currency' currency={currency} />
                            }
                        </div>
                        {is_visible &&
                        <div className='trade-container__price-info-movement'>
                            {(!has_error_or_not_loaded && has_increased !== null) &&
                                <IconPriceMove type={has_increased ? 'profit' : 'loss'} />
                            }
                        </div>
                        }
                    </div>
                    <Tooltip
                        alignment='left'
                        className={classNames('trade-container__price-tooltip', { 'trade-container__price-tooltip--disabled': has_error_or_not_loaded })}
                        classNameIcon='trade-container__price-tooltip-i'
                        icon='info'
                        message={has_error_or_not_loaded ? '' : proposal_info.message}
                    />
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
