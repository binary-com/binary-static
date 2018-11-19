import React                from 'react';
import PropTypes            from 'prop-types';
import { localize }         from '_common/localize';
import URL                  from '_common/url';
import FullPageModal        from 'App/Components/Elements/FullPageModal/full_page_modal.jsx';
import { connect }          from 'Stores/connect';
import Localize             from 'App/Components/Elements/localize.jsx';

const onConfirm = async (client) => {
    await client.switchAccount(client.getAccountOfType('virtual').loginid);
};

const onCancel = () => {
    window.location.href = URL.urlFor('trading');
};

const DenialOfServiceModal = ({ client, is_visible }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with my virtual account')}
        cancel_button_text={localize('Visit main website')}
        onConfirm={() => onConfirm(client)}
        onCancel={onCancel}
        is_visible={is_visible}
    >
        <Localize str='You are not allowed to access this feature with your real money account at the moment.' />
    </FullPageModal>
);

DenialOfServiceModal.propTypes = {
    show: PropTypes.bool,
};

const denial_of_service = connect(
    ({ client }) => ({
        is_visible: !client.is_client_allowed_to_visit,
        client,
    }),
)(DenialOfServiceModal);
export default denial_of_service;
