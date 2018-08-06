import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { IconQuickPortfolio } from '../../../../Assets/Footer';

const TogglePortfolio = ({
    is_disabled,
    is_portfolio_drawer_on,
    togglePortfolioDrawer,
  }) => {
    const toggle_portfolio_class = classNames('ic-portfolio', {
        'ic-portfolio--active'  : is_portfolio_drawer_on,
        'ic-portfolio--disabled': is_disabled,
    });
    console.log(is_disabled);
    return (
        <a
            href='javascript:;'
            className={toggle_portfolio_class}
            onClick={is_disabled ? undefined : togglePortfolioDrawer}
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
