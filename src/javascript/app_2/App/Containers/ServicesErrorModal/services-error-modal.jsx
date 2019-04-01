import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import { connect }   from 'Stores/connect';
import { title }    from './constants';

const ServicesErrorModal = ({
    is_services_error_visible,
    services_error,
    toggleServicesErrorModal,
}) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    return (
        <FullPageModal
            title={title[services_error.type]}
            confirm_button_text={localize('OK')}
            onConfirm={toggleServicesErrorModal.bind(this, false)}
            // TODO: handle onCancel
            // cancel_button_text={cancel_button_text}
            // onCancel={onCancel}
            is_visible={is_services_error_visible}
        >
            {message}
        </FullPageModal>
    );
};

ServicesErrorModal.propTypes = {
    services_error: PropTypes.object,
};

export default connect (
    ({ common, ui }) => ({
        services_error           : common.services_error,
        is_services_error_visible: ui.is_services_error_visible,
        toggleServicesErrorModal : ui.toggleServicesErrorModal,
    }),
)(ServicesErrorModal);
