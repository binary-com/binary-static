import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '_common/localize';
import Button       from '../../Form/button.jsx';

const InstallPWAButton = ({
    prompt_event,
    onClick,
}) => {

    const showPrompt = () => {
        if (prompt_event) {
            prompt_event.prompt();


            prompt_event.userChoice
                .then(choice_result => {
                    if (choice_result.outcome === 'accepted') {
                        onClick();
                    }
                });
        }
    };

    return (
        <Button
            className='primary orang'
            has_effect
            text={localize('Install')}
            onClick={showPrompt}
        />
    );
};

InstallPWAButton.propTypes = {
    onClick     : PropTypes.func,
    prompt_event: PropTypes.object,
};

export { InstallPWAButton };
