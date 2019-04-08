import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import { urlFor }    from '_common/url';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';
import { connect }   from 'Stores/connect';

const onConfirm = async (client) => {
    await client.switchAccount(client.virtual_account_loginid);
};

const onCancel = () => {
    window.open(urlFor('trading', undefined, undefined, true));
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
    client    : PropTypes.object,
    is_visible: PropTypes.bool,
};

const denial_of_service = connect(
    ({ client }) => ({
        is_visible: !client.is_client_allowed_to_visit,
        client,
    }),
)(DenialOfServiceModal);
export default denial_of_service;
