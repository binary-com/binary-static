import PropTypes           from 'prop-types';
import React               from 'react';
import Money               from '../money.jsx';
import { getContractPath } from '../../../../App/Components/Routes/helpers';
import RedirectOnClick     from '../../../../App/Components/Routes/redirect_onclick.jsx';
import RemainingTime       from '../../../../App/Containers/remaining_time.jsx';
import ContractTypeCell    from '../../../../Modules/Portfolio/Components/contract_type_cell.jsx';

const PortfolioDrawerCard = ({
    currency,
    expiry_time,
    id,
    indicative,
    status,
    type,
    underlying,
}) => (
    <RedirectOnClick className='portfolio-drawer-card' path={getContractPath(id)}>
        <div className='portfolio-drawer-card__type'>
            <ContractTypeCell type={type} />
        </div>
        <div className={`portfolio-drawer-card__indicative portfolio-drawer-card__indicative--${status}`}>
            <Money amount={indicative} currency={currency} />
        </div>
        <span className='portfolio-drawer-card__symbol'>{underlying}</span>
        <span className='portfolio-drawer-card__remaining-time'>
            <RemainingTime end_time={expiry_time} />
        </span>
    </RedirectOnClick>
);

PortfolioDrawerCard.propTypes = {
    currency   : PropTypes.string,
    expiry_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    id        : PropTypes.number,
    indicative: PropTypes.number,
    status    : PropTypes.string,
    type      : PropTypes.string,
    underlying: PropTypes.string,
};

export default PortfolioDrawerCard;
