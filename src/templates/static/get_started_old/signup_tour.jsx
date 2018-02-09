import React from 'react';

const SignupTour = ({ is_jp }) => (
    <div className='gr-3 gr-hide-m'>
        <div className='sidebar-right'>
            <div className='client_logged_out invisible fill-bg-color gr-gutter'>
                <p className='gr-padding-20 no-margin gr-gutter center-text'>
                    <a href={it.url_for(is_jp ? 'home-jp' : '/') }>{it.L('Try it now')}</a>
                    <br />
                    {it.L('No risk, $10K virtual money account')}
                </p>
            </div>
            <div className='fill-bg-color gr-gutter'>
                <p className='gr-padding-20 gr-gutter center-text'>
                    {it.L('Want to learn more?')}
                    <br />
                    <a href={it.url_for(`tour${is_jp ? '-jp' : ''}`)}>{it.L('View the Tour')}</a>
                </p>
            </div>
        </div>
    </div>
);

export default SignupTour;
