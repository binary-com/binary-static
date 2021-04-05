import React from 'react';
import Head from './head.jsx';
import { CONTENT_PLACEHOLDER, WithLayout } from './layout.jsx';
import InterviewPopup from '../components/interview_popup.jsx';
import Elevio from '../includes/elevio.jsx';
import LiveChat from '../includes/livechat.jsx';

const Layout = () => {
    if (it.is_pjax_request) {
        return <WithLayout>{CONTENT_PLACEHOLDER}</WithLayout>;
    }

    return (
        <html>
            <Head />
            <body className={it.language}>
                <div id='msg_notification' className='notice-msg center-text' />
                <div id='page-wrapper'>
                    <div id='dashboard-wrapper'>
                        <div id='content-holder'>
                            <WithLayout>{CONTENT_PLACEHOLDER}</WithLayout>
                        </div>
                    </div>
                </div>
                <InterviewPopup /> {/* TODO: remove when UX research is finished */}
                <Elevio />
                <LiveChat />
            </body>
        </html>
    );
};

export default Layout;
