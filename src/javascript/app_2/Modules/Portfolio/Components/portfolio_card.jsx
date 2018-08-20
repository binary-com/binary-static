import PropTypes           from 'prop-types';
import React               from 'react';
import ContractLink        from '../../Contract/Components/contract_link.jsx';
import Money               from '../../../App/Components/Elements/money.jsx';
import { getContractPath } from '../../../App/Components/Routes/helpers';
import RedirectOnClick     from '../../../App/Components/Routes/redirect_onclick.jsx';
import RemainingTime       from '../../../App/Containers/remaining_time.jsx';

const PortfolioCard = ({
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
    <RedirectOnClick className='portfolio-card card-list__card' path={getContractPath(id)}>
        <div className='portfolio-card__header'>
            <span className='portfolio-card__date'>
                <RemainingTime end_time={expiry_time} />
            </span>
            <span className='portfolio-card__refid'>
                <ContractLink contract_id={id} text={reference} />
            </span>
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
    </RedirectOnClick>
);

PortfolioCard.propTypes = {
    currency   : PropTypes.string,
    details    : PropTypes.string,
    expiry_time: PropTypes.string,
    id         : PropTypes.number,
    indicative : PropTypes.number,
    payout     : PropTypes.number,
    purchase   : PropTypes.number,
    reference  : PropTypes.number,
    status     : PropTypes.string,
};

export default PortfolioCard;
