import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';

const PortfolioDrawerCard = ({ }) => (
    <div className='portfolio-drawer-card'>
    </div>
);

PortfolioDrawerCard.propTypes = {
    indicative    : PropTypes.number,
    remaining_time: PropTypes.string,
};

export default PortfolioDrawerCard;
