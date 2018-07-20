import PropTypes    from 'prop-types';
import React        from 'react';
import Button       from '../../Form/button.jsx';
import { localize } from '../../../../../_common/localize';

const UpgradeButton = ({ onClick }) => (
    <Button
        id='acc-balance-btn'
        className='primary orange'
        has_effect
        text={localize('Upgrade')}
        onClick={onClick}
    />
);

UpgradeButton.propTypes = {
    onClick: PropTypes.func,
};

export { UpgradeButton };