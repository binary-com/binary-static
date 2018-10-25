import React                from 'react';
import PropTypes            from 'prop-types';
import { getAccountOfType } from '_common/base/client_base';
import { localize }         from '_common/localize';
import URL                  from '_common/url';
import FullPageModal        from 'App/Components/Elements/FullPageModal/full_page_modal.jsx';
import { switchAccount }    from 'Services/Helpers/switch_account';

const onConfirm = () => {
    switchAccount(getAccountOfType('virtual').loginid);
};

const onCancel  = () => {
    window.location.href = URL.urlFor('trading');
};

const DenialOfServiceModal = ({ visible }) => (
    <FullPageModal
        title={localize('Whoops!')}
        body={localize('Sorry, Only virtual accounts can access this feature at the moment.')}
        confirm_button_text={localize('Continue with my virtual account')}
        cancel_button_text={localize('Visit main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        visible={visible}
    />
);

DenialOfServiceModal.propTypes = {
    visible: PropTypes.bool,
};
export default DenialOfServiceModal;
