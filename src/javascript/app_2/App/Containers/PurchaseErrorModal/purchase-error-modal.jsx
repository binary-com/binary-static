import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import { connect }   from 'Stores/connect';

const PurchaseErrorModal = ({
    is_purchase_error_visible,
    togglePurchaseErrorModal,
    purchase_error,
}) => {
    const { code, message } = purchase_error;

    if (!code || !message) return null;

    return (
        <FullPageModal
            title={localize('Purchase Error')}
            confirm_button_text={localize('OK')}
            onConfirm={togglePurchaseErrorModal.bind(this, false)}
            // TODO: handle onCancel
            // cancel_button_text={cancel_button_text}
            // onCancel={onCancel}
            is_visible={is_purchase_error_visible}
        >
            {message}
        </FullPageModal>
    );
};

PurchaseErrorModal.propTypes = {
    purchase_error: PropTypes.object,
};

export default connect (
    ({ modules, ui }) => ({
        purchase_error           : modules.trade.purchase_error,
        is_purchase_error_visible: ui.is_purchase_error_visible,
        togglePurchaseErrorModal : ui.togglePurchaseErrorModal,
    }),
)(PurchaseErrorModal);
