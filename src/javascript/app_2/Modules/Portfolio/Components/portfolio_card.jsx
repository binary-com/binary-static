import PropTypes from 'prop-types';
import React     from 'react';

// Mobile view for portfolio items
const PortfolioCard = ({
    reference,
    details,
    remaining_time,
    indicative,
    payout,
    purchase,
    currency,
}) => (
    // TODO: Update styling once UI is ready
    <div className='statement-card card-list__card'>
        <div className='statement-card__header'>
            <span className='statement-card__refid'>{ reference.transaction_id }</span>
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

PortfolioCard.propTypes = {
    reference     : PropTypes.object,
    details       : PropTypes.string,
    remaining_time: PropTypes.string,
    indicative    : PropTypes.object,
    payout        : PropTypes.string,
    purchase      : PropTypes.string,
    currency      : PropTypes.string,
};

export default PortfolioCard;
