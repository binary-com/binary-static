import React from 'react';
import Localize from 'App/Components/Elements/localize.jsx';

class DenialOfServiceModal extends React.Component {
    onConfirm = () => {
        window.location.href = '/';
    };

    render = () => (
        <div className='DenialOfService'>
            <div className='DenialBox'>
                <h1><Localize str='Access denied.' /></h1>
                <p><Localize str='Sorry, you cannot access this application at the current time. That is all we know.' /></p>
                <div
                    className='btn flat effect primary'
                    onClick={this.onConfirm}
                >
                    <span>
                        <Localize str='Visit main website' />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default DenialOfServiceModal;
