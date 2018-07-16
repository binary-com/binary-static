import PropTypes from 'prop-types';
import React     from 'react';
import Popover   from '../../../Components/Elements/popover.jsx';

const TogglePortfolio = ({
    is_portfolio_drawer_on,
    togglePortfolioDrawer,
  }) => (
      <Popover
          subtitle='Quick Portfolio'
      >
          <a
              href='javascript:;'
              className={`${is_portfolio_drawer_on ? 'ic-portfolio-active' : 'ic-portfolio' }`}
              onClick={togglePortfolioDrawer}
          />
      </Popover>
);

TogglePortfolio.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    togglePortfolioDrawer : PropTypes.func,
};

export { TogglePortfolio };
