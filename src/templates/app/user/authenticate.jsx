import React                                       from 'react';
import Loading                                     from '../../_common/components/loading.jsx';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs }                                  from '../../_common/components/tabs.jsx';
import { AuthenticateMessage, UnsupportedMessage } from '../_includes/authenticate_message.jsx';

const ArrowsMobile = ({ direction, parent }) => (
    <div className='align-self-center gr-2 gr-hide gr-show-m gr-no-gutter'>
        <img
            className={`go-${direction} gr-5 gr-no-gutter gr-centered`}
            data-parent={parent}
            src={it.url_for(`images/pages/home/arrow_${direction}.svg`)}
        />
    </div>
);

const Authenticate = () => (
    <React.Fragment>
        <div id='logout_title' className='invisible'>
            <h1 className='gr-padding-10'>{it.L('Authentication')}</h1>
        </div>

        <div id='authentication_verified' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
            <h1 className='gr-padding-10'>{it.L('Your account has been verified successfully')}</h1>
        </div>

        <div id='authentication_tab'>
            <TabContainer className='gr-parent full-width gr-11 gr-12-m gr-centered' theme='light'>
                <div className='gr-row gr-hide gr-show-m mobile-menu'>
                    <ArrowsMobile parent='authentication_tab' direction='left' />
                    <strong id='tab_mobile_header' className='align-self-center gr-8' />
                    <ArrowsMobile parent='authentication_tab' direction='right' />
                </div>
                <TabsSubtabs
                    id='authentication_tab'
                    className='gr-parent tab-selector-wrapper gr-hide-m'
                    items={[
                        { id: 'poi',      text: it.L('Proof of identity') },
                        { id: 'poa',      text: it.L('Proof of address') },
                        { id: 'authentication_tab_selector', className: 'tab-selector' },
                    ]}
                />
            </TabContainer>
            <div className='tab-content'>
                <TabContentContainer>
                    <TabContent id='poi' className='selectedTab'>
                        <div id='onfido' />
                        <div id='not_authenticated_uns' className='invisible'>
                            <UnsupportedMessage />
                        </div>
                        <div id='upload_complete' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/letter.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity was submitted successfully')}</h1>
                            <p>{it.L('Your document is being reviewed, please check back in 1-3 days')}</p>
                        </div>

                        <div id='error_occured' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/clock.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Sorry,')}</h1>
                            <p>{it.L('there was a connection error. Please try again later.')}</p>
                        </div>

                        <div id='expired_poi' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity has expired')}</h1>
                            <p>{it.L('Kindly send a scan of a valid proof of identity to [_1]support@binary.com[_2]', '<a href="mailto:support@binary.com" target="_blank">', '</a>')}</p>
                        </div>

                        <div id='unverified' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Proof of identity verification failed')}</h1>
                            <p>{it.L('Please check your email for details')}</p>
                        </div>

                        <div id='verified' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity has been verified successfully')}</h1>
                        </div>
                    </TabContent>
                    <TabContent id='poa'>
                        <div id='authentication'>
                            <div id='authentication-message'>
                                <div id='not_authenticated' className='invisible'>
                                    <AuthenticateMessage />
                                </div>
    
                                <div id='verified_poa' className='center-text gr-gutter gr-padding-20 invisible'>
                                    <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                                    <h1>{it.L('Your proof of address has been verified successfully')}</h1>
                                </div>
    
                                <div id='pending_poa' className='center-text gr-gutter gr-padding-20 invisible'>
                                    <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/letter.svg')} />
                                    <h1 className='gr-padding-10'>{it.L('Your proof of address was submitted successfully')}</h1>
                                    <p>{it.L('Your document is being reviewed, please check back in 1-3 days')}</p>
                                </div>

                                <div id='expired_poa' className='center-text gr-padding-20 invisible'>
                                    <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                                    <h1 className='gr-padding-10'>{it.L('Your proof of address has expired')}</h1>
                                    <p>{it.L('Kindly send a scan of a valid proof of address to [_1]support@binary.com[_2]', '<a href="mailto:support@binary.com" target="_blank">', '</a>')}</p>
                                </div>
    
                                <div id='unverified_poa' className='center-text gr-gutter gr-padding-20 invisible'>
                                    <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                                    <h1 className='gr-padding-10'>{it.L('Proof of address verification failed')}</h1>
                                    <p>{it.L('Please check your email for details')}</p>
                                </div>
    
                                <p className='center-text notice-msg invisible' id='error_message' />
                            </div>
                        </div>
                    </TabContent>
                </TabContentContainer>
            </div>
        </div>
        <Loading id='authentication_loading' />
    </React.Fragment>
);

export default Authenticate;
