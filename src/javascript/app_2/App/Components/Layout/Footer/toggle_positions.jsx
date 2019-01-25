import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { IconQuickPortfolio } from 'Assets/Footer';

const TogglePositions = ({
                             is_positions_drawer_on,
                             togglePositionsDrawer,
                         }) => {
    const toggle_positions_class = classNames('ic-portfolio', {
        'active': is_positions_drawer_on,
    });
    return (
        <a
            href='javascript:;'
            className={toggle_positions_class}
            onClick={togglePositionsDrawer}
        >
            <IconQuickPortfolio className='footer-icon' />
        </a>
    );
};

TogglePositions.propTypes = {
    is_positions_drawer_on: PropTypes.bool,
    togglePositionsDrawer : PropTypes.func,
};

export { TogglePositions };
