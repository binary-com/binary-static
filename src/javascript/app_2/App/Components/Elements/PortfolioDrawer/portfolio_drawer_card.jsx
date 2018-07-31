import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';

const PortfolioDrawerCard = ({ type, indicative, symbol, remaining_time }) => (
    <div className='portfolio-drawer-card'>
        <div className='portfolio-drawer-card__type'>{type}</div>
        <div className='portfolio-drawer-card__indicative'>{indicative}</div>
        <span className='portfolio-drawer-card__symbol'>{symbol}</span>
        <span className='portfolio-drawer-card__remaining-time'>{remaining_time}</span>
    </div>
);

PortfolioDrawerCard.propTypes = {
    indicative    : PropTypes.number,
    remaining_time: PropTypes.string,
    status        : PropTypes.string,
};

export default PortfolioDrawerCard;
