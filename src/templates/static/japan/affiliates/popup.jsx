import React from 'react';

const Popup = () => (
    <div className='gr-12 gr-padding-10 center-text'>
        <div className='gr-parent gr-padding-10'>
            <img src={it.url_for('images/logo/binary_logo_dark.svg')} alt='' style={{ maxHeight: 55 }} />
        </div>
        <h2>{it.L('{JAPAN ONLY}Welcome to the site of Binary KK.')}</h2>
        <p className='justify-text'>{it.L('{JAPAN ONLY}Please note that the website that you have just visited is not our site. Information regarding the Company\'s financial instruments that have been posted on that site, any evaluation, impression, etc. are the sole responsibility of the administrators of that website, and has been created by them only. We can make no guarantee or accept any responsibility for their content.')}</p>

        <div className='gr-padding-10'>
            <a id='btn_affiliate_proceed' className='button'>
                <span>{it.L('{JAPAN ONLY}Proceed to official site')}</span>
            </a>
        </div>

        <div className='separator-line-thin-gray separator-line' />

        <p>
            <strong>{it.L('{JAPAN ONLY}Binary Co., Ltd.')}</strong><br />
            {it.L('{JAPAN ONLY}Licensed by the Kanto Local Financial Bureau (Finance Division) No. 2949')}<br />
            {it.L('{JAPAN ONLY}Member Associations: Financial Futures Association Japan')}
        </p>
    </div>
);

export default Popup;
