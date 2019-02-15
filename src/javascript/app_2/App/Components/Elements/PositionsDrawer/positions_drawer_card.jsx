import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ContractTypeCell    from 'Modules/Portfolio/Components/contract_type_cell.jsx';
import { localize }        from '_common/localize';
import Money               from '../money.jsx';
import BinaryLink          from '../../Routes/binary_link.jsx';
import { getContractPath } from '../../Routes/helpers';
import ProgressSlider      from '../../../Containers/PositionsDrawer/ProgressSlider';

const PositionsDrawerCard = ({
    className,
    currency,
    expiry_time,
    id,
    indicative,
    profit_loss,
    purchase,
    purchase_time,
    status,
    tick_count,
    type,
    underlying_code,
    underlying_name,
}) => (
    <BinaryLink
        className={classNames('positions-drawer-card', className)}
        to={getContractPath(id)}
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
                purchase_time={purchase_time}
                expiry_time={expiry_time}
                ticks_count={tick_count}
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
                    {localize('Potential P/L:')}
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
    </BinaryLink>
);

PositionsDrawerCard.propTypes = {
    className  : PropTypes.string,
    currency   : PropTypes.string,
    expiry_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    id           : PropTypes.number,
    indicative   : PropTypes.number,
    profit_loss  : PropTypes.number,
    purchase     : PropTypes.number,
    purchase_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    status         : PropTypes.string,
    tick_count     : PropTypes.number,
    type           : PropTypes.string,
    underlying_code: PropTypes.string,
    underlying_name: PropTypes.string,
};

export default PositionsDrawerCard;
