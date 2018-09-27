
import React from 'react';

const VPNApp = () => (
    <div className='vpn-app'>
        <h1>VPN app</h1>
        <p>{it.L('Establish a secure, encrypted connection to a virtual private network (VPN) server using our VPN app to protect your data and privacy.')}</p>
        <div className='center-text'>
            <h2>{it.L('How it works')}</h2>
            <p>{it.L('Secure your internet connection in three easy steps:')}</p>
            <div className='steps steps-vertical'>
                <div className='step'>
                    <div className='circle'>1</div>
                    <div className='content gr-row gr-padding-10 gr-row-align-between'>
                        <p>{it.L('Download our VPN app for your preferred device')}</p>
                        <img className='vpn-app-icon' src={it.url_for('images/pages/settings/2fa.svg')} />
                    </div>
                </div>
                <div className='step'>
                    <div className='circle'>2</div>
                    <div className='content gr-row gr-padding-10 gr-row-align-between'>
                        <p>{it.L('Activate the VPN service on the app')}</p>
                        <img className='vpn-app-icon' src={it.url_for('images/pages/settings/2fa.svg')} />
                    </div>
                </div>
                <div className='step'>
                    <div className='circle'>3</div>
                    <div className='content gr-row gr-padding-10 gr-row-align-between'>
                        <p>{it.L('Browse and trade securely on your preferred device')}</p>
                        <img className='vpn-app-icon' src={it.url_for('images/pages/settings/2fa.svg')} />
                    </div>
                </div>
            </div>
        </div>
        <div className='border-bottom'>&nbsp;</div>
        <div className='cta-download-heading center-text'>
            <h2>{it.L('Download our VPN app now')}</h2>
            <img src='https://placehold.it/300x200' />
        </div>
        <div className='mobile-app gr-row gr-row-align-around'>
            <div className='full-width gr-row gr-row-align-around gr-padding-20'>
                <div className='column gr-gutter-right'>
                    <p className='small-tex right'>{it.L('For Desktop')}</p>
                    <div className='gr-padding-10'>
                        <a className='button' href='#'>
                            <img src='https://placehold.it/120x37' />
                        </a>
                        <a className='button' href='#'>
                            <img src='https://placehold.it/120x37' />
                        </a>
                    </div>
                </div>
                <div className='vertical-divider' />
                <div className='column gr-gutter-left'>
                    <p className='small-tex right'>{it.L('For Mobile')}</p>
                    <div className='gr-padding-10'>
                        <a className='button' href='#'>
                            <img src='https://placehold.it/120x37' />
                        </a>
                        <a className='button' href='#'>
                            <img src='https://placehold.it/120x37' />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default VPNApp;
