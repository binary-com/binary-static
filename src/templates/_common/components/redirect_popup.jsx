import React from 'react';
import HTMLComment from './html_comment.jsx';
import { FormRow } from './forms.jsx';

const RedirectPopup = () => (
    <div id='redirect_popup_container' className='invisible'>
        <HTMLComment>googleoff: all</HTMLComment>{/* https://support.google.com/gsa/answer/6329153?hl=en#82542 */}
        <div className='popup'>
            <div className='popup__inner'>
                <div className='popup__close' />
                <h3 className='popup__head'>{it.L('Check out our new home')}</h3>
                <div className='popup__body'>
                    <p>
                        {it.L('It’s everything you know and love about [_1] but with a better trading experience and new trade types.', it.website_name)}
                    </p>
                    <p>
                        {it.L('Try it now. Log in with your [_1] username and password. No sign-up needed.', it.website_name)}
                    </p>
                </div>
                <div className='popup__checkbox'>
                    <input id='redirect_popup_checkbox' type='checkbox' />
                    <label htmlFor='redirect_popup_checkbox'>
                        <span>{it.L('Don’t show this message again')}</span>
                    </label>
                </div>
                <div className='popup__options'>
                    <a id='redirect_popup_login' className='button button-secondary'>
                        <span>{it.L('Log in to Deriv')}</span>
                    </a>
                    <a id='edirect_popup_more' className='button'>
                        <span>{it.L('Learn more')}</span>
                    </a>
                </div>
            </div>
        </div>
        <HTMLComment>googleon: all</HTMLComment>
    </div>
);

export default RedirectPopup;
