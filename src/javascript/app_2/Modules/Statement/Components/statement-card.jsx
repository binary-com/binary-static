import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { NavLink }         from 'react-router-dom';
import {
    IconBuy,
    IconDeposit,
    IconSell,
    IconPayout,
    IconWallet,
    IconWithdrawal }       from 'Assets/Statement';
import { getContractPath } from 'App/Components/Routes/helpers';

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
}) => {
    const icon = action.toLowerCase();

    const content = (
        <React.Fragment>
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
                        {icon === 'sell'        && <IconSell className='statement-card__icon' />}
                        {icon === 'buy'         && <IconBuy className='statement-card__icon' />}
                        {icon === 'deposit'     && <IconDeposit className='statement-card__icon' />}
                        {icon === 'withdrawal'  && <IconWithdrawal className='statement-card__icon' />}
                        <span className='statement-card__cell-text'>
                            {amount}
                        </span>
                    </div>
                    <div className='statement-card__cell statement-card__payout'>
                        <IconPayout className='statement-card__icon' />
                        <span className='statement-card__cell-text'>
                            {payout}
                        </span>
                    </div>
                    <div className='statement-card__cell statement-card__balance'>
                        <IconWallet className='statement-card__icon' />
                        <span className='statement-card__cell-text'>
                            {balance}
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

    const class_name = classNames('statement-card', className);

    return (
        id ?
            <NavLink className={class_name} activeClassName='active' to={getContractPath(id)}>
                {content}
            </NavLink>
            :
            <div className={class_name}>
                {content}
            </div>
    );
};

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
