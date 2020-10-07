import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const TncApproval = () => (
    <React.Fragment>
        <div id='tnc_container' className='gr-12'>
            <div id='tnc_loading'><Loading /></div>

            <div className='gr-row gr-parent invisible' id='tnc_approval'>
                <div className='gr-2 gr-6-m gr-centered-m'>
                    <img className='responsive' src={it.url_for('images/pages/cashier/protection-icon.svg')} />
                </div>
                <div className='gr-10 gr-12-m'>
                    <h2>{it.L('We have updated our terms and conditions')}</h2>
                    <form>
                        <p id='tnc_message'>{it.L('As part of our rebranding, we have updated our [_1]terms and conditions[_2] which can be viewed at Deriv.com. Note that all [_3] users are now bound by the terms and conditions of Deriv. Please review and accept them to continue using our services. ', `<a href='${it.url_for('terms-and-conditions')}'>`, '</a>', it.website_name)}</p>
                        <div className='gr-12 center-text'>
                            <button className='button' id='btn_accept'>{it.L('Agree and continue')}</button>
                        </div>
                    </form>
                </div>
            </div>

            <p className='gr-12 gr-parent invisible error-msg center-text' id='err_message' />
        </div>
    </React.Fragment>
);

export default TncApproval;
