import React             from 'react';
import {
    AuthenticateMessage,
    UnsupportedMessage } from '../_includes/authenticate_message.jsx';
import { Button }        from '../../_common/components/elements.jsx';
import Loading           from '../../_common/components/loading.jsx';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs }        from '../../_common/components/tabs.jsx';

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
    <div className='authentication'>
        <div id='logout_title' className='invisible'>
            <h1 className='gr-padding-10'>{it.L('Authentication')}</h1>
        </div>

        <div id='not_required_msg' className='notice-msg center-text gr-padding-10 invisible'>
            <p>{it.L('Your account does not need authentication at this time.[_1]We will inform you if authentication is required in the future.', '<br />')}</p>
        </div>

        <div id='authentication_verified' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
            <h1 className='gr-padding-10'>{it.L('Your account has been verified successfully')}</h1>
        </div>

        <div id='authentication_unneeded' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
            <h1 className='gr-padding-10'>{it.L('You do not need to authenticate your account at this time')}</h1>
            <p>{it.L('We will inform you when your account needs to be authenticated.')}</p>
        </div>

        <div id='authentication_tab' className='gr-padding-20'>
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
                        <p id='msg_personal_details' className='gr-padding-10 center-text notice-msg invisible'>
                            {it.L('Before uploading your document, please ensure that your [_1]personal details[_2] are updated to match your proof of identity. This will help to avoid delays during the verification process.', `<a href=${it.url_for('user/settings/detailsws')} target="_blank">`, '</a>')}
                        </p>
                        <div id='onfido' />
                        <div id='not_authenticated_uns' className='invisible'>
                            <UnsupportedMessage />
                        </div>
                        <div id='upload_complete' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity was submitted successfully')}</h1>
                            <p id='text_pending_poi_pending' className='invisible'>{it.L('Your document is being reviewed, please check back in 1-3 days.')}</p>
                            <p id='text_pending_poa_required' className='invisible'>{it.L('Your document is being reviewed, please check back in 1-3 days. You must also submit a proof of address.')}</p>
                            <Button
                                id='button_pending_poa_required'
                                className='button invisible'
                                href={`${it.url_for('user/authenticate')}?authentication_tab=poa`}
                                text={it.L('Proof of address')}
                            />
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

                        <div id='last_rejection_poi' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity submission failed because:')}</h1>
                            <div className='gr-8 gr-12-m gr-centered gr-no-gutter gr-gutter-m'>
                                <ul id='last_rejection_list' className='rejected' />
                                <span
                                    className='invisible'
                                    id='last_rejection_more'
                                >
                                    {it.L('Show more')}
                                </span>
                                <span
                                    className='invisible'
                                    id='last_rejection_less'
                                >
                                    {it.L('Show less')}
                                </span>
                            </div>
                            <button
                                className='button'
                                id='last_rejection_button'
                            >
                                {it.L('Upload document')}
                            </button>
                        </div>

                        <div id='limited_poi' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('You\'ve reached the limit for uploading your documents.')}</h1>
                            <p>{it.L('Please contact us via [_1]live chat[_2].', `<a href=${it.url_for('contact')} target="_blank">`, '</a>')}</p>
                        </div>

                        <div id='unverified' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Proof of identity verification failed')}</h1>
                            <p>{it.L('We were unable to verify your document automatically. We will try to verify your document manually. Please check back in 1-3 days.')}</p>
                        </div>

                        <div id='verified' className='center-text gr-padding-20 invisible'>
                            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                            <h1 className='gr-padding-10'>{it.L('Your proof of identity has been verified successfully')}</h1>
                            <p id='text_verified_poa_required' className='invisible'>{it.L('You must also submit a proof of address.')}</p>
                            <Button
                                id='button_verified_poa_required'
                                className='button invisible'
                                href={`${it.url_for('user/authenticate')}?authentication_tab=poa`}
                                text={it.L('Proof of address')}
                            />
                        </div>

                        <div id='personal_details_error' className='center-text gr-padding-20 invisible'>
                            <h2 className='gr-padding-10'>{it.L('Update your personal details')}</h2>
                            <p>{it.L('We can\'t validate your personal details because there is some information missing.')}</p>
                            <p>{it.L('Please update your [_1] to continue.', '<span id="missing_personal_fields"></span>')}</p>
                            <Button
                                className='button'
                                href={it.url_for('user/settings/detailsws')}
                                text={it.L('Update my details')}
                            />
                            <p>{it.L('Need help? [_1]Contact us[_2].', `<a href="${it.url_for('contact')}">`, '</a>')}</p>
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
                                    <p id='text_verified_poi_required' className='invisible'>{it.L('You must also submit a proof of identity.')}</p>
                                    <Button
                                        id='button_verified_poi_required'
                                        className='button invisible'
                                        href={`${it.url_for('user/authenticate')}?authentication_tab=poi`}
                                        text={it.L('Proof of identity')}
                                    />
                                </div>

                                <div id='pending_poa' className='center-text gr-gutter gr-padding-20 invisible'>
                                    <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/valid.svg')} />
                                    <h1 className='gr-padding-10'>{it.L('Your proof of address was submitted successfully')}</h1>
                                    <p id='text_pending_poa_pending' className='invisible'>{it.L('Your document is being reviewed, please check back in 1-3 days.')}</p>
                                    <p id='text_pending_poi_required' className='invisible'>{it.L('Your document is being reviewed, please check back in 1-3 days. You must also submit a proof of identity.')}</p>
                                    <Button
                                        id='button_pending_poi_required'
                                        className='button invisible'
                                        href={`${it.url_for('user/authenticate')}?authentication_tab=poi`}
                                        text={it.L('Proof of identity')}
                                    />
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
    </div>
);

export default Authenticate;
