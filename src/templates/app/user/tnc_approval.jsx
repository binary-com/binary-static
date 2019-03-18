import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const TncApproval = () => (
    <React.Fragment>
        <div id='tnc_container' className='gr-12'>
            <div id='tnc_loading'><Loading /></div>

            <div className='gr-row gr-parent invisible' id='tnc_approval'>
                <div className='gr-2 gr-6-m gr-centered-m'>
                    <p><img className='responsive' src={it.url_for('images/pages/cashier/protection-icon.svg')} /></p>
                </div>
                <div className='gr-10 gr-12-m'>
                    <form>
                        <p id='tnc_message'>{it.L('[_1] has updated its [_2]Terms & Conditions[_3]. By clicking OK, you confirm that you have read and accepted the updated [_2]Terms & Conditions[_3].', it.website_name, `<a href="${it.url_for('terms-and-conditions')}">`, '</a>')}</p>
                        <div className='gr-3 gr-6-m gr-centered'>
                            <span className='button'>
                                <button className='button' id='btn_accept'>{it.L('OK')}</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            <p className='gr-12 gr-parent invisible error-msg center-text' id='err_message' />
        </div>
    </React.Fragment>
);

export default TncApproval;
