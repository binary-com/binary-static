import PropTypes from 'prop-types';
import React     from 'react';
import Money     from '../../../App/Components/Elements/money.jsx';

const PortfolioCard = ({
    reference,
    details,
    remaining_time,
    indicative,
    payout,
    purchase,
    currency,
    status,
}) => (
    <div className='portfolio-card card-list__card'>
        <div className='portfolio-card__header'>
            <span className='portfolio-card__date'>{ remaining_time }</span>
            <span className='portfolio-card__refid'>{ reference }</span>
        </div>
        <div className='portfolio-card__body'>
            <div className='portfolio-card__desc'>{details}</div>
            <div className='portfolio-card__row'>
                <div className='portfolio-card__cell portfolio-card__purchase'>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={purchase} currency={currency} />
                    </span>
                </div>
                <div className='portfolio-card__cell portfolio-card__payout'>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={payout} currency={currency} />
                    </span>
                </div>
                <div className={`portfolio-card__cell portfolio-card__indicative portfolio-card__indicative--${status}`}>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={indicative} currency={currency} />
                    </span>
                </div>
            </div>
        </div>
    </div>
);

PortfolioCard.propTypes = {
    reference     : PropTypes.number,
    details       : PropTypes.string,
    remaining_time: PropTypes.string,
    indicative    : PropTypes.number,
    payout        : PropTypes.number,
    purchase      : PropTypes.number,
    currency      : PropTypes.string,
    status        : PropTypes.string,
};

export default PortfolioCard;
