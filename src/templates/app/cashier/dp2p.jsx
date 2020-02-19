import React   from 'react';
import Loading from '../../_common/components/loading.jsx';

const DP2P = () => (
    <React.Fragment>
        <div className='invisible' id='message_cashier_unavailable'>
            <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
        </div>
        <div className='invisible' id='message_dp2p_mobile_view'>
            <p className='notice-msg center-text'>{it.L('Sorry, mobile version is not available yet.')}</p>
        </div>
        <div id='loading_p2p'>
            <Loading />
        </div>
        <div className='invisible' id='binary_dp2p' />
    </React.Fragment>
);

export default DP2P;
