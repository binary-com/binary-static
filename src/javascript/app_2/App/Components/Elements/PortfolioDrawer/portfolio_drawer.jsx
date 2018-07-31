import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';
import PortfolioDrawerCard            from './portfolio_drawer_card.jsx';

const PortfolioDrawer = ({ is_portfolio_drawer_on, toggleDrawer }) => (
    <div className={classNames('portfolio-drawer', {
        'portfolio-drawer--open': is_portfolio_drawer_on,
    })}>
        <div className='portfolio-drawer__header'>
            <span className='portfolio-drawer__icon-main ic-portfolio' />
            <span className='portfolio-drawer__title'>{localize('Portfolio Quick Menu')}</span>
            <a
                href='javascript:;'
                className='portfolio-drawer__icon-close'
                onClick={toggleDrawer}
            />
        </div>
        <div className='portfolio-drawer__body'>
            <PortfolioDrawerCard
                type='Rise'
                symbol='Gold/USD'
                indicative={0.84}
                remaining_time='00:08:17'
                currency='USD'
            />
        </div>
    </div>
);

PortfolioDrawer.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        toggleDrawer          : ui.togglePortfolioDrawer,
    })
)(PortfolioDrawer);
