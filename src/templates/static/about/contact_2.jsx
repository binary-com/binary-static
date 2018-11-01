import React      from 'react';
import { Select } from '../../_common/components/elements.jsx';
import Loading    from '../../_common/components/loading.jsx';

const Contact2 = () => (
    <React.Fragment>
        <div id='contact_2_loading'>
            <Loading />
        </div>
        <div id='contact_2' className='static_full contact invisible'>
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
                        <div className='gr-row phone-container'>
                            <div className='gr-col'>
                                <img className='responsive' src={it.url_for('images/pages/contact_2/contact-icon.svg')} />
                            </div>
                            <div className='gr-col gr-adapt number-container'>
                                <div className='gr-row gr-centered-m'>
                                    <div className='gr-adapt'>
                                        <label htmlFor='cs_telephone_number'><strong>{it.L('Telephone:')}</strong></label>
                                        <Select
                                            id='cs_telephone_number'
                                            options={[
                                                { text: it.L('Australia'),      value: it.L('[_1] (Toll Free)', '+61 (02) 8294 5448, 1800 093570') },
                                                { text: it.L('Canada'),         value: '+1 (450) 823 1002' },
                                                { text: it.L('Ireland'),        value: it.L('[_1] (Toll Free)', '+353 (0) 76 888 7500, 1800931084') },
                                                { text: it.L('Poland'),         value: '+48 58 881 00 02' },
                                                { text: it.L('Russia'),         value: it.L('[_1] (Toll Free)', '8 10 8002 8553011') },
                                                { text: it.L('United Kingdom'), value: it.L('[_1] (Toll Free)', '+44 (0) 1666 800042, 0800 011 9847'), selected: true },
                                            ]}
                                        />
                                    </div>
                                    <div className='gr-adapt' id='display_cs_telephone'>
                                        <a href='tel: +44 (0) 1666 800042'>{('+44 (0) 1666 800042')}</a>
                                        <span>{it.L('[_1] (Toll Free)', '<a href="tel:0800 011 9847">0800 011 9847</a>')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='center-text'>
                            <p>{it.L('If you are not located in the above-mentioned countries, simply dial any of our contact numbers for help.')}</p>
                        </div>
                        <div className='hint center-text calls_recording'>
                            * {it.L('All calls are recorded for training and monitoring purposes')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Contact2;
