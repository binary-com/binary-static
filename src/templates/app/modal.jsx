import React from 'react';

const Dialog = () => (
    <React.Fragment>
        <div id='modal_interview' className='modal_container'>
            <div className='modal_header'>
                <h1>{it.L('Can you spare 15 minutes?')}</h1>
            </div>
            <div className='modal_body'>
                <h2>{it.L('We’d love to hear what you think.')}</h2>
                <p>
                    {it.L(
                        'We’re looking to improve our products and services, and we want to understand your needs better. We’d like to interview you via phone, to know what you like about us, what you don’t like, and where we can do better.'
                    )}
                </p>
            </div>
            <div className='modal_footer'>
                <div className='inline_option'>
                    <a className='button-primary'>
                        {it.L('No thanks')} <div className='border_right' />
                    </a>
                    <a className='button-primary'>{it.L('Ask me later')}</a>
                </div>
                <a className='button-primary'>{it.L('I’m interested')}</a>
            </div>
        </div>
    </React.Fragment>
);

export default Dialog;
