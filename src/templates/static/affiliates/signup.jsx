import React from 'react';
import FAQ from './faq.jsx';
import Main from './main.jsx';

const Signup = () => (
    <div className='static_full'>
        <h1>{it.L('Affiliate')}</h1>

        <div className='content-tab-container gr-padding-10'>
            <div className='tab-menu'>
                <div className='tab-menu-wrap container'>
                    <ul className='tm-ul'>
                        <li id='general_info' className='tm-li active first'><span className='menu-wrap-a'><span className='menu-wrap-b'><span className='tm-a a-active'>{it.L('Affiliate')}</span></span></span></li>
                        <li id='faq' className='tm-li last'><a href='#faq' className='tm-a'>{it.L('FAQ')}</a></li>
                    </ul>
                </div>
            </div>
            <div className='tab-content container'>
                <div className='tab-content-wrapper'>
                    <div id='general_info-content' className='toggle-content'>
                        <Main />
                    </div>
                    <div id='faq-content' className='toggle-content invisible'>
                        <FAQ />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Signup;
