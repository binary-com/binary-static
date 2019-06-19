import React from 'react';

const Authenticate = () => (
    <React.Fragment>
        <div id='onfido' />

        <div id='upload_complete' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/letter.svg')} />
            <h1 className='gr-padding-10'>{it.L('Thank you for uploading your documents!')}</h1>
            <p>{it.L('We will send an email after verifying your documents')}</p>
        </div>

        <div id='error_occured' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/clock.svg')} />
            <h1 className='gr-padding-10'>{it.L('Sorry,')}</h1>
            <p>{it.L('there was a connection error. Please try again later.')}</p>
        </div>

        <div id='unverified' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
            <h1 className='gr-padding-10'>{it.L('Sorry, the authentication was not successful.')}</h1>
            <p>{it.L('Don\'t worry, we will send you an email to assist you further.')}</p>
        </div>

        <div id='verified' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
            <h1 className='gr-padding-10'>{it.L('You have been successfully verified')}</h1>
        </div>
    </React.Fragment>
);

export default Authenticate;
