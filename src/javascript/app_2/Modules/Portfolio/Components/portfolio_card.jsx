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
    status,
}) => (
    // TODO: implement portfolio card mockup (once available)
    <div className='statement-card card-list__card'>
        <div className='statement-card__header'>
            <span className='statement-card__date'>{ remaining_time }</span>
            <span className='statement-card__refid'>{ reference }</span>
        </div>
        <div className='statement-card__body'>
            <div className='statement-card__desc'>{details}</div>
            <div className='statement-card__row'>
                {indicative &&
                    <div className={`statement-card__cell statement-card__amount${status && (status === 'price-moved-up' ? '--sell' : '--buy')}`}>
                        <span className='statement-card__cell-text'>
                            <span className={`symbols ${currency}`}/>
                            {indicative}
                        </span>
                    </div>
                }
                <div className='statement-card__cell statement-card__balance'>
                    <span className='statement-card__cell-text'>
                        <span className={`symbols ${currency}`}/>
                        {purchase}
                    </span>
                </div>
                <div className='statement-card__cell statement-card__payout'>
                    <span className='statement-card__cell-text'>
                        <span className={`symbols ${currency}`}/>
                        {payout}
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
    indicative    : PropTypes.string,
    payout        : PropTypes.number,
    purchase      : PropTypes.number,
    currency      : PropTypes.string,
    status        : PropTypes.string,
};

export default PortfolioCard;
