import React        from 'react';
import PropTypes    from 'prop-types';
import classnames   from 'classnames';

const StatementCard = ({ date, refid, desc, action, amount, payout, balance, className }) => (
    <div className={classnames('statement-card', className)}>
        <div className='statement-card__header'>
            <span className='statement-card__date'>{date}</span>
            <span className='statement-card__refid'>{refid}</span>
        </div>
        <div className='statement-card__body'>
            <div className='statement-card__desc'>{desc}</div>
            <div className='statement-card__row'>
                <div className={classnames('statement-card__cell statement-card__amount', {
                    'statement-card__amount--buy'       : action === 'Buy',
                    'statement-card__amount--sell'      : action === 'Sell',
                    'statement-card__amount--deposit'   : action === 'Deposit',
                    'statement-card__amount--withdrawal': action === 'Withdrawal',
                })}
                >
                    <span className='statement-card__cell-text'>
                        {amount}
                    </span>
                </div>
                <div className='statement-card__cell statement-card__payout'>
                    <span className='statement-card__cell-text'>
                        {payout}
                    </span>
                </div>
                <div className='statement-card__cell statement-card__balance'>
                    <span className='statement-card__cell-text'>
                        {balance}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

StatementCard.propTypes = {
    action   : PropTypes.string,
    amount   : PropTypes.string,
    balance  : PropTypes.string,
    className: PropTypes.string,
    date     : PropTypes.string,
    desc     : PropTypes.string,
    payout   : PropTypes.string,
    refid    : PropTypes.string,
};

export default StatementCard;