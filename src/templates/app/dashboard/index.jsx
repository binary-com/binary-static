import React   from 'react';
import Loading from '../../_common/components/loading.jsx';

const Dashboard = () => (
    <React.Fragment>
        <div className='invisible' id='message_cashier_unavailable'>
            <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
        </div>
        <div className='invisible' id='message_dashboard_mobile_view'>
            <p className='notice-msg center-text'>{it.L('Sorry, mobile version is not available yet.')}</p>
        </div>
        <div id='loading_dashboard'>
            <Loading />
        </div>
        <div className='invisible' id='binary_dashboard' />
    </React.Fragment>
);

export default Dashboard;
