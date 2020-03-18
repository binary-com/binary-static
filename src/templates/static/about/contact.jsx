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

                <div className='gr-row'>
                    <div className='gr-7 gr-8-t gr-12-p gr-12-m gr-centered gr-padding-30'>
                        <h2 className='center-text'>{it.L('Can\'t find what you\'re searching for?')}</h2>
                        <div className='gr-row gr-row-align-middle gr-row-align-center phone-container'>
                            <div className='gr-2 gr-4-m center-text'>
                                <img className='responsive' src={it.url_for('images/pages/contact/contact-icon.svg')} />
                            </div>
                            <div className='gr-10 gr-11-m gr-8-p gr-8-t number-container'>
                                <div className='gr-row gr-centered-m'>
                                    <div className='gr-adapt'>
                                        <label htmlFor='cs_telephone_number'><strong>{it.L('Telephone:')}</strong></label>
                                        <div className='gr-adapt' id='display_cs_telephone'>
                                            <span>{it.L('[_1] (United Kingdom)', '<a href="tel:+44 1942 316229">+44 1942 316229</a>')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='hint center-text calls_recording gr-padding-10'>
                            * {it.L('All calls are recorded for training and monitoring purposes')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Contact;
