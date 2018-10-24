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

const DenialOfServiceModal = ({ show }) => (
    <FullPageModal
        title={localize('Whoops!')}
        body={localize('Sorry, Only virtual accounts can access this feature at the moment.')}
        confirmButtonText={localize('Continue with my virtual account')}
        cancelButtonText={localize('Visit main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        show={show}
    />
);

DenialOfServiceModal.propTypes = {
    show: PropTypes.bool,
};
export default DenialOfServiceModal;
