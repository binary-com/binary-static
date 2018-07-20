import PropTypes    from 'prop-types';
import React        from 'react';
import Button       from '../../Form/button.jsx';
import { localize } from '../../../../../_common/localize';

const LoginButton = ({ onClick }) => (
    <Button
        className='primary orange'
        has_effect
        text={localize('Log in')}
        onClick={onClick}
    />
);

LoginButton.propTypes = {
    onClick: PropTypes.func,
};

export { LoginButton };