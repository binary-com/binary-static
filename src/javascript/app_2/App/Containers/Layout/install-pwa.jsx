import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import { localize } from '_common/localize';
import Button       from '../../Components/Form/button.jsx';

const InstallPWA = ({
    pwa_prompt_event,
    removePWAPromptEvent,
}) => {
    const showPrompt = () => {
        if (pwa_prompt_event) {
            pwa_prompt_event.prompt();
            pwa_prompt_event.userChoice
                .then(choice_result => {
                    if (choice_result.outcome === 'accepted') {
                        removePWAPromptEvent();
                    }
                });
        }
    };

    return (
        <React.Fragment>
            <p>{localize('Want quick and easy access to world markets?')}</p>
            <Button
                className='btn--secondary notification-bar__button'
                has_effect
                text={localize('Get the Binary.com app')}
                onClick={showPrompt}
            />
        </React.Fragment>
    );
};

InstallPWA.propTypes = {
    pwa_prompt_event    : PropTypes.object,
    removePWAPromptEvent: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        pwa_prompt_event    : ui.pwa_prompt_event,
        removePWAPromptEvent: ui.removePWAPromptEvent,
    })
)(InstallPWA);
