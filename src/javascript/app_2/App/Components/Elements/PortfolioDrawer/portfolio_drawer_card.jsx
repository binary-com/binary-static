import PropTypes           from 'prop-types';
import React               from 'react';
import Money               from '../money.jsx';
import { getContractPath } from '../../../../App/Components/Routes/helpers';
import RedirectOnClick     from '../../../../App/Components/Routes/redirect_onclick.jsx';
import ContractTypeCell    from '../../../../Modules/Portfolio/Components/contract_type_cell.jsx';

const PortfolioDrawerCard = ({ type, indicative, underlying, remaining_time, currency, status, id }) => (
    <RedirectOnClick className='portfolio-drawer-card' path={getContractPath(id)}>
        <div className='portfolio-drawer-card__type'>
            <ContractTypeCell type={type} />
        </div>
        <div className={`portfolio-drawer-card__indicative portfolio-drawer-card__indicative--${status}`}>
            <Money amount={indicative} currency={currency} />
        </div>
        <span className='portfolio-drawer-card__symbol'>{underlying}</span>
        <span className='portfolio-drawer-card__remaining-time'>{remaining_time}</span>
    </RedirectOnClick>
);

PortfolioDrawerCard.propTypes = {
    type          : PropTypes.string,
    underlying    : PropTypes.string,
    currency      : PropTypes.string,
    id            : PropTypes.number,
    indicative    : PropTypes.number,
    remaining_time: PropTypes.string,
    status        : PropTypes.string,
};

export default PortfolioDrawerCard;
