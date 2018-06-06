import React     from 'react';
import PropTypes from 'prop-types';

const PortfolioCard = ({
        id,
        details,
        remaining_time,
        indicative,
        payout,
        purchase,
        currency,
    }) => (
        <div className='statement-card card-list__card'>
            <div className='statement-card__header'>
                <span className='statement-card__refid'>{ id }</span>
                <span className='statement-card__date'>{ remaining_time }</span>
            </div>
            <div className='statement-card__body'>
                <div className='statement-card__desc'>{details}</div>
                <div className='statement-card__row'>
                    {indicative.amount &&
                        <div className={`statement-card__cell statement-card__amount--${indicative.style && indicative.style === 'price_moved_up' ? 'buy' : 'sell'}`}>
                            <span className='statement-card__cell-text'>
                                <span className={`symbols ${currency}`}/>
                                {indicative.amount}
                            </span>
                        </div>
                    }
                    <div className='statement-card__cell statement-card__payout'>
                        <span className='statement-card__cell-text'>
                            <span className={`symbols ${currency}`}/>
                            {payout}
                        </span>
                    </div>
                    <div className='statement-card__cell statement-card__balance'>
                        <span className='statement-card__cell-text'>
                            <span className={`symbols ${currency}`}/>
                            {purchase}
                        </span>
                    </div>
                </div>
            </div>
        </div>
);

export default PortfolioCard;

PortfolioCard.propTypes = {
    id            : PropTypes.number,
    details       : PropTypes.string,
    remaining_time: PropTypes.string,
    indicative    : PropTypes.object,
    payout        : PropTypes.string,
    purchase      : PropTypes.string,
    currency      : PropTypes.string,
};