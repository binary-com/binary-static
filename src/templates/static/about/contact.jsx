import React      from 'react';
import Loading    from '../../_common/components/loading.jsx';

const Contact = () => (
    <React.Fragment>
        <div id='contact_loading'>
            <Loading />
        </div>
        <div id='contact' className='static_full contact invisible'>
            <div id='top_banner'>
                <div className='search align-self-center'>
                    <h1 className='center-text'>{it.L('How can we help?')}</h1>
                    <div id='elevio_element_search' />
                </div>
            </div>
            <div id='elevio_menu_container'>
                <div id='elevio_element_menu' className='container align-self-center' />
            </div>
            <div id='contact_content' className='container'>
                <div className='elevio-container gr-padding-30'>
                    <div id='elevio_element_suggestions' />
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Contact;
