import PropTypes           from 'prop-types';
import React               from 'react';
import { NavLink }         from 'react-router-dom';
import Money               from 'App/Components/Elements/money.jsx';
import { getContractPath } from 'App/Components/Routes/helpers';
import RemainingTime       from 'App/Containers/remaining_time.jsx';

const PositionsCard = ({
    currency,
    details,
    expiry_time,
    id,
    indicative,
    payout,
    purchase,
    reference,
    status,
}) => (
    <NavLink className='positions-card card-list__card' activeClassName='active' to={getContractPath(id)}>
        <div className='positions-card__header'>
            <span className='positions-card__date'>
                <RemainingTime end_time={expiry_time} />
            </span>
            <span className='positions-card__refid'>
                {reference}
            </span>
        </div>
        <div className='positions-card__body'>
            <div className='positions-card__desc'>{details}</div>
            <div className='positions-card__row'>
                <div className='positions-card__cell positions-card__purchase'>
                    <span className='positions-card__cell-text'>
                        <Money amount={purchase} currency={currency} />
                    </span>
                </div>
                <div className='positions-card__cell positions-card__payout'>
                    <span className='positions-card__cell-text'>
                        <Money amount={payout} currency={currency} />
                    </span>
                </div>
                <div className={`positions-card__cell positions-card__indicative positions-card__indicative--${status}`}>
                    <span className='positions-card__cell-text'>
                        <Money amount={indicative} currency={currency} />
                    </span>
                </div>
            </div>
        </div>
    </NavLink>
);

PositionsCard.propTypes = {
    currency   : PropTypes.string,
    details    : PropTypes.string,
    expiry_time: PropTypes.number,
    id         : PropTypes.number,
    indicative : PropTypes.number,
    payout     : PropTypes.number,
    purchase   : PropTypes.number,
    reference  : PropTypes.number,
    status     : PropTypes.string,
};

export default PositionsCard;
