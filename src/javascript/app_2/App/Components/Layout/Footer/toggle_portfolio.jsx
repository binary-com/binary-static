import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { IconQuickPortfolio } from 'Assets/Footer';

const TogglePortfolio = ({
    is_portfolio_drawer_on,
    togglePortfolioDrawer,
}) => {
    const toggle_portfolio_class = classNames('ic-portfolio', {
        'active': is_portfolio_drawer_on,
    });
    return (
        <a
            href='javascript:;'
            className={toggle_portfolio_class}
            onClick={togglePortfolioDrawer}
        >
            <IconQuickPortfolio className='footer-icon' />
        </a>
    );
};

TogglePortfolio.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    togglePortfolioDrawer : PropTypes.func,
};

export { TogglePortfolio };
