import React                from 'react';
import PropTypes            from 'prop-types';
import { getAccountOfType } from '_common/base/client_base';
import { localize }         from '_common/localize';
import URL                  from '_common/url';
import FullPageModal        from 'App/Components/Elements/FullPageModal/full_page_modal.jsx';
import Localize             from 'App/Components/Elements/localize.jsx';
import { switchAccount }    from 'Services/Helpers/switch_account';

const onConfirm = () => {
    switchAccount(getAccountOfType('virtual').loginid);
};

const onCancel = () => {
    window.location.href = URL.urlFor('trading');
};

const DenialOfServiceModal = ({ is_visible }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with my virtual account')}
        cancel_button_text={localize('Visit main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        is_visible={is_visible}
    >
        <Localize str='Sorry, only virtual and Costa Rica accounts can access this feature at the moment.' />
    </FullPageModal>
);

DenialOfServiceModal.propTypes = {
    is_visible: PropTypes.bool,
};
export default DenialOfServiceModal;
