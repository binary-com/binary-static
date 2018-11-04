import React                from 'react';
import PropTypes            from 'prop-types';
import { getAccountOfType } from '_common/base/client_base';
import { localize }         from '_common/localize';
import URL                  from '_common/url';
import FullPageModal        from 'App/Components/Elements/FullPageModal/full_page_modal.jsx';
import { connect }          from 'Stores/connect';
import Localize             from 'App/Components/Elements/localize.jsx';

const onConfirm = (client) => {
    client.switchAccount(getAccountOfType('virtual').loginid);
};

const onCancel = () => {
    window.location.href = URL.urlFor('trading');
};

const DenialOfServiceModal = ({ client, show }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with my virtual account')}
        cancel_button_text={localize('Visit main website')}
        onConfirm={() => onConfirm(client)}
        onCancel={onCancel}
        show={show}
    >
        <Localize str='Sorry, Only virtual accounts can access this feature at the moment.' />
    </FullPageModal>
);

DenialOfServiceModal.propTypes = {
    show: PropTypes.bool,
};

const denial_of_service = connect(
    ({ client }) => ({
        show: !client.is_client_allowed_to_visit,
        client,
    }),
)(DenialOfServiceModal);
export default denial_of_service;
