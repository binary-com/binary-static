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

        <div id='idv-container' className='idv-main-container'>
            <div id='idv_country_selector' className='idv-container country-selector invisible'>
                <h1 className='idv-container__header'>{it.L('Verify your identity')}</h1>
                <p>{it.L('In which country was your document issued?')}</p>
                <select className='idv-container__dropdown long-text' type='select' id='country_dropdown' />
                <Button
                    id='button_next_country_selected'
                    className='button gr-padding-20'
                    text_className='margin-top-40'
                    text={it.L('Next')}
                />
            </div>

            <div id='idv_document_submit' className='idv-container invisible'>
                <div className='document-submit center-text'>
                    <img className='idv-container__main-icon' src={it.url_for('images/pages/authenticate/verify_identity.svg')} />
                    <h1 className='idv-container__header'>{it.L('Verify your identity')}</h1>
                    <p className='btm-spacer'>{it.L('Please select the document type and enter the document number.')}</p>
                </div>
                <div className='idv-container__document-container'>
                    <p id='idv_personal_detail_msg' className='invisible'>{it.L('Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to [_1]account settings[_2].', `<a class="idv-container__link" href="${it.url_for('user/settings/detailsws')}">`, '</a>')}</p>
                    <div id='idv_document_left' className='idv-container__left'>
                        <fieldset>
                            <select className='idv-container__dropdown long-text' type='select' id='document_type' />
                        </fieldset>
                        <fieldset>
                            <input
                                id='document_number'
                                type='text'
                                maxLength={20}
                                className='idv-container__input'
                                placeholder={it.L(('Enter your document number'))}
                            />
                            <span id='document_example_format' />
                        </fieldset>
                    </div>
                    <div id='idv_document_right' className='idv-container__right invisible'>
                        <p className='sample-image-text'>{it.L('Sample:')}</p>
                        <div className='sample-image-container'>
                            <img id='document_sample_image' alt='document sample image' />
                        </div>
                    </div>
                </div>
                <div className='idv-container__button-wrapper'>
                    <Button
                        id='idv_document_submit_back_btn'
                        className='button button-secondary'
                        text={it.L('Go Back')}
                    >
                        <span className='child-span'>
                            <img src={it.url_for('images/pages/authenticate/arrow_left.svg')} />
                            {it.L('Go Back')}
                        </span>
                    </Button>
                    <Button
                        id='idv_document_submit_verify_btn'
                        className='button'
                        text={it.L('Verify')}
                    />
                </div>
            </div>

            <div id='idv_document_verified' className='idv-container invisible'>
                <img className='idv-container__main-icon' src={it.url_for('images/pages/authenticate/verification_passed.svg')} />
                <h1 className='idv-container__header'>{it.L('We\'ve successfully verified your document number')}</h1>
            </div>

            <div id='idv_document_expired' className='idv-container invisible'>
                <img className='idv-container__main-icon' src={it.url_for('images/pages/authenticate/verification_failed.svg')} />
                <h1 className='idv-container__header'>{it.L('Verification of document number failed')}</h1>
                <p>{it.L('It looks like your identity document has expired. Please try again with a valid document.')}</p>
                <Button
                    id='idv_expired_btn'
                    className='button idv-status'
                    text={it.L('Try again')}
                />
            </div>

            <div id='idv_document_failed' className='idv-container invisible'>
                <img className='idv-container__main-icon' src={it.url_for('images/pages/authenticate/verification_failed.svg')} />
                <h1 className='idv-container__header'>{it.L('Verification of document number failed')}</h1>
                <p>{it.L('We were unable to verify your identity based on the details you entered.')}</p>
                <p id='idv_document_failed_text' className='invisible'>
                    {it.L('Please upload your identity document.')}
                </p>
                <Button
                    id='idv_document_failed_try_again_btn'
                    className='button idv-status'
                    href={`${it.url_for('user/authenticate')}?authentication_tab=poi`}
                    text={it.L('Try again')}
                />
                <Button
                    id='idv_document_failed_upload_btn'
                    className='button idv-status'
                    href={`${it.url_for('user/authenticate')}?authentication_tab=poi`}
                    text={it.L('Upload identity document')}
                />
            </div>

            <div id='idv_submit_pending' className='center-text gr-padding-20 invisible'>
                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/submit_successfully.svg')} />
                <h1 className='gr-padding-10'>{it.L('We\'ve received your document number')}</h1>
                <p>{it.L('We\'ll process your details within a few minutes and notify its status via email.')}</p>
            </div>
        </div>

        <div id='authentication_unneeded' className='center-text gr-padding-20 invisible'>
            <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/invalid.svg')} />
            <h1 className='gr-padding-10'>{it.L('You do not need to authenticate your account at this time')}</h1>
            <p>{it.L('We will inform you when your account needs to be authenticated.')}</p>
        </div>

        <div id='authentication_tab' className='gr-padding-20 invisible'>
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
                            <h1 className='gr-padding-10'>{it.L('New proof of identity document needed')}</h1>
                            <button
                                className='button'
                                id='expired_button'
                            >
                                {it.L('Upload document')}
                            </button>
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

                        <div className='idv-main-container'>
                            <div id='idv_submit_pending_need_poa' className='center-text gr-padding-20 invisible'>
                                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/submit_successfully.svg')} />
                                <h1 className='gr-padding-10'>{it.L('We\'ve received your document number')}</h1>
                                <p>{it.L('We\'ll process your details within a few minutes and notify its status via email. Next, we\'ll need your proof of address')}</p>
                                <Button
                                    id='idv_pending_submit_poa_btn'
                                    className='button idv-status'
                                    text={it.L('Submit proof of address')}
                                />
                            </div>

                            <div id='idv_document_verified_need_poa' className='center-text gr-padding-20 invisible'>
                                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/verification_passed.svg')} />
                                <h1 className='gr-padding-10'>{it.L('Your document number has been verified')}</h1>
                                <p>{it.L('Next, we\'ll need your proof of address')}</p>
                                <Button
                                    id='idv_verified_poa_btn'
                                    className='button idv-status'
                                    href={`${it.url_for('user/authenticate')}?authentication_tab=poa`}
                                    text={it.L('Submit proof of address')}
                                />
                            </div>

                            <div id='idv_document_verified_poi' className='center-text gr-padding-20 invisible'>
                                <img className='gr-padding-20' src={it.url_for('images/pages/authenticate/verification_passed.svg')} />
                                <h1 className='gr-padding-10'>{it.L('We\'ve successfully verified your document number')}</h1>
                            </div>
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
