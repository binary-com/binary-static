import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const TogglePortfolio = ({
    is_portfolio_drawer_on,
    togglePortfolioDrawer,
  }) => {
    const toggle_portolio_class = classNames('ic-portfolio', {
        'active': is_portfolio_drawer_on,
    });
    return (
        <a
            href='javascript:;'
            className={toggle_portolio_class}
            onClick={togglePortfolioDrawer}
        />
    );
};

TogglePortfolio.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    togglePortfolioDrawer : PropTypes.func,
};

export { TogglePortfolio };
