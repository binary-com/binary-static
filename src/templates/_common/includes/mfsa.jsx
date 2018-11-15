import React from 'react';

const MFSA = () => {
    const style = {
        display: 'none',
    };
    return (
        <div style={style} className='container mfsa_message'>
            <div className='notice-msg center-text gr-parent gr-child'>
                <p>{it.L('In the EU, financial binary options are only available to professional investors.')} <a id='professional-cta' className='invisible' href={it.url_for('user/settings/professional')}>{it.L('Apply now as a professional investor')}</a>
                </p>
            </div>
        </div>
    );
};

export default MFSA;
