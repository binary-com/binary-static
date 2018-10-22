import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import FullPageModal from '../FullPageModal/full_page_modal.jsx';

class DenialOfServiceModal extends React.Component {
    onConfirm = () => {
        window.location.href = '/';
    };

    render = () => (<FullPageModal
        title={localize('Access denied.')}
        body={localize('Sorry, you cannot access this application at the current time. That is all we know.')}
        buttonText={localize('Visit main website')}
        onConfirm={this.onConfirm}
        show={this.props.show}
    />);
}

DenialOfServiceModal.propTypes = {
    show: PropTypes.oneOfType([
        PropTypes.bool, PropTypes.func,
    ]),
};
export default DenialOfServiceModal;
