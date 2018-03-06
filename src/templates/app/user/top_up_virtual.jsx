import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const TopUpVirtual = () => (
    <React.Fragment>
        <div className='gr-12'>
            <h1>{it.L('Give Me More Money!')}</h1>
            <div className='loading'><Loading /></div>
            <div id='topup_virtual' className='center-text'>
                <div id='viewError' className='viewItem invisible'>
                    <p className='notice-msg' />
                </div>

                <div id='viewSuccess' className='viewItem invisible'>
                    <p className='success-msg' />
                    <a className='button' href={it.url_for('user/portfoliows')}>
                        <span>{it.L('View Updated Portfolio')}</span>
                    </a>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default TopUpVirtual;
