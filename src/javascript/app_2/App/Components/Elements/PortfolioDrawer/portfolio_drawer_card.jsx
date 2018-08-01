import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import Money                          from '../money.jsx';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';
import ContractTypeCell               from '../../../../Modules/Portfolio/Components/contract_type_cell.jsx';

const PortfolioDrawerCard = ({ type, indicative, underlying, remaining_time, currency, status }) => (
    <div className='portfolio-drawer-card'>
        <div className='portfolio-drawer-card__type'>
            <ContractTypeCell type={type} />
        </div>
        <div className={`portfolio-drawer-card__indicative portfolio-drawer-card__indicative--${status}`}>
            <Money amount={indicative} currency={currency} />
        </div>
        <span className='portfolio-drawer-card__symbol'>{underlying}</span>
        <span className='portfolio-drawer-card__remaining-time'>{remaining_time}</span>
    </div>
);

PortfolioDrawerCard.propTypes = {
    indicative    : PropTypes.number,
    remaining_time: PropTypes.string,
    status        : PropTypes.string,
};

export default PortfolioDrawerCard;
