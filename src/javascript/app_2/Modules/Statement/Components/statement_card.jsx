import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { NavLink }         from 'react-router-dom';
import { getContractPath } from '../../../App/Components/Routes/helpers';

const StatementCard = ({
    action,
    amount,
    balance,
    className,
    date,
    desc,
    id,
    payout,
    refid,
}) => (
    <NavLink className={classNames('statement-card', className)} activeClassName='active' to={getContractPath(id)}>
        <div className='statement-card__header'>
            <span className='statement-card__date'>{date}</span>
            <span className='statement-card__refid'>
                {refid}
            </span>
        </div>
        <div className='statement-card__body'>
            <div className='statement-card__desc'>{desc}</div>
            <div className='statement-card__row'>
                <div className={`statement-card__cell statement-card__amount statement-card__amount--${action.toLowerCase()}`}>
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
    </NavLink>
);

StatementCard.propTypes = {
    action   : PropTypes.string,
    amount   : PropTypes.string,
    balance  : PropTypes.string,
    className: PropTypes.string,
    date     : PropTypes.string,
    desc     : PropTypes.string,
    id       : PropTypes.string,
    payout   : PropTypes.string,
    refid    : PropTypes.string,
};

export default StatementCard;
