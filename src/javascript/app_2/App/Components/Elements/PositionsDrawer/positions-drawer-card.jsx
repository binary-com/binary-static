import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import ContractLink          from 'Modules/Contract/Containers/contract-link.jsx';
import { localize }          from '_common/localize';
import ContractTypeCell      from 'Modules/Portfolio/Components/contract-type-cell.jsx';
import ProgressSlider        from './ProgressSlider';
import ResultDetails         from './result-details.jsx';
import ResultOverlay         from './result-overlay.jsx';
import { getTimePercentage } from './helpers';
import Money                 from '../money.jsx';
import Button                from '../../Form/button.jsx';

// TODO: Break into smaller components once design is finalized
const PositionsDrawerCard = ({
    active_position,
    barrier,
    className,
    currency,
    duration,
    duration_unit,
    entry_spot,
    expiry_time,
    id,
    id_sell,
    indicative,
    is_valid_to_sell,
    profit_loss,
    purchase,
    purchase_time,
    onClickSell,
    onClickRemove,
    openContract,
    result,
    sell_time,
    server_time,
    status,
    tick_count,
    type,
    underlying_code,
    underlying_name,
}) => {
    const percentage = getTimePercentage(server_time, purchase_time, expiry_time);
    return (
        <div className={classNames(
            'positions-drawer-card__wrapper', {
                'positions-drawer-card__wrapper--active': (parseInt(active_position) === id),
            },
            className)}
        >
            <ResultOverlay
                id={id}
                onClickRemove={onClickRemove}
                onClick={openContract}
                result={result}
            />
            <ContractLink
                className={classNames(
                    'positions-drawer-card', {
                        'positions-drawer-card--active': (parseInt(active_position) === id),
                        'positions-drawer-card--green' : (profit_loss > 0) && !result,
                        'positions-drawer-card--red'   : (profit_loss < 0) && !result,
                    }
                )}
                contract_id={id}
            >
                <React.Fragment>
                    <div className={classNames(
                        'positions-drawer-card__grid',
                        'positions-drawer-card__grid-underlying-trade'
                    )}
                    >
                        <div className='positions-drawer-card__underlying-name'>
                            <div
                                className={classNames(
                                    'icons-underlying',
                                    `icons-underlying__ic-${underlying_code || 'unknown'}`
                                )}
                            />
                            <span className='positions-drawer-card__symbol'>{underlying_name}</span>
                        </div>
                        <div className='positions-drawer-card__type'>
                            <ContractTypeCell type={type} />
                        </div>
                    </div>
                    <ProgressSlider
                        remaining_time={expiry_time}
                        percentage={percentage}
                        ticks_count={tick_count}
                        has_result={!!(result)}
                    />
                    <div className={classNames(
                        'positions-drawer-card__grid',
                        'positions-drawer-card__grid-profit-payout'
                    )}
                    >
                        <div className={classNames(
                            'positions-drawer-card__profit-loss',
                            'positions-drawer-card__profit-loss-label',
                        )}
                        >
                            {result ? localize('P/L:') : localize('Potential P/L:')}
                        </div>
                        <div className={classNames(
                            'positions-drawer-card__indicative',
                            'positions-drawer-card__indicative-label',
                        )}
                        >
                            {localize('Potential Payout:')}
                        </div>
                        <div className={classNames(
                            'positions-drawer-card__profit-loss', {
                                'positions-drawer-card__profit-loss--negative': (profit_loss < 0),
                                'positions-drawer-card__profit-loss--positive': (profit_loss > 0),
                            })}
                        >
                            <Money amount={Math.abs(profit_loss)} currency={currency} />
                        </div>
                        <div className={`positions-drawer-card__indicative positions-drawer-card__indicative--${status}`}>
                            <Money amount={indicative} currency={currency} />
                        </div>
                    </div>
                    <div className='positions-drawer-card__purchase-price'>
                        <span className='positions-drawer-card__purchase-label'>
                            {localize('Purchase price')}
                        </span>
                        <Money amount={purchase} currency={currency} />
                    </div>
                </React.Fragment>
            </ContractLink>
            <CSSTransition
                in={!!(is_valid_to_sell)}
                timeout={250}
                classNames={{
                    enter    : 'positions-drawer-card__sell-button--enter',
                    enterDone: 'positions-drawer-card__sell-button--enter-done',
                    exit     : 'positions-drawer-card__sell-button--exit',
                }}
                unmountOnExit
            >
                <div className='positions-drawer-card__sell-button'>
                    <Button
                        className='btn--primary btn--primary--orange'
                        is_disabled={!is_valid_to_sell}
                        text={localize('Sell contract')}
                        onClick={() => onClickSell(id)}
                    />
                </div>
            </CSSTransition>
            <ResultDetails
                barrier={barrier}
                contract_end_time={sell_time}
                contract_start_time={purchase_time}
                duration={duration}
                duration_unit={duration_unit}
                entry_spot={entry_spot}
                tick_count={tick_count}
                has_result={!!(result)}
                id_sell={id_sell}
            />
        </div>
    );
};

PositionsDrawerCard.propTypes = {
    active_position: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    barrier      : PropTypes.number,
    className    : PropTypes.string,
    currency     : PropTypes.string,
    duration     : PropTypes.number,
    duration_unit: PropTypes.string,
    entry_spot   : PropTypes.number,
    exit_spot    : PropTypes.number,
    expiry_time  : PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    id              : PropTypes.number,
    id_sell         : PropTypes.number,
    indicative      : PropTypes.number,
    is_valid_to_sell: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool,
    ]),
    onClickRemove: PropTypes.func,
    onClickSell  : PropTypes.func,
    openContract : PropTypes.func,
    profit_loss  : PropTypes.number,
    purchase     : PropTypes.number,
    purchase_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    result   : PropTypes.string,
    sell_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    server_time    : PropTypes.object,
    status         : PropTypes.string,
    tick_count     : PropTypes.number,
    type           : PropTypes.string,
    underlying_code: PropTypes.string,
    underlying_name: PropTypes.string,
};

export default PositionsDrawerCard;
