import React from 'react';
// import Footer from './footer.jsx';
import Head from './head.jsx';
import Header from './header.jsx';
// import MobileMenu from './mobile_menu.jsx';
import InterviewPopup from '../components/interview_popup.jsx';
import Title from '../components/title.jsx';
import DerivIFrame from '../includes/deriv-iframe.jsx';
// import Elevio from '../includes/elevio.jsx';
import Gtm from '../includes/gtm.jsx';
import LiveChat from '../includes/livechat.jsx';
import LanguageMenuModal from '../components/language-menu-modal.jsx';

export const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

export const WithLayout = ({ children }) => {
    const content_class = `${it.current_route || ''}-content`;
    return (
        <div id='content' className={it.current_route ? content_class : undefined}>
            <div id='page_info' style={{ display: 'none' }}>
                <Title />
                <div id='content_class'>{content_class}</div>
            </div>
            {it.layout !== 'full_width' ?
                <div className='container'>
                    {children}
                </div> :
                children
            }
        </div>
    );
};

const InnerContent = () => (
    it.layout ?
        <WithLayout> {CONTENT_PLACEHOLDER} </WithLayout>
        : CONTENT_PLACEHOLDER
);

const Topbar = () => (
    <div className='no-print primary-bg-color-dark topbar mobile-hide'>
        <div id='topbar-info'>
            <div id='network_status_wrapper' className='no-underline' data-balloon-pos='up'>
                <div className='network_status' />
            </div>
            <div id='language-select'><img id='language-select__logo' /></div>
            <span className='no-underline nowrap gmt-clock' />
            <div id='topbar-help-centre'>
                <img src={it.url_for('images/pages/footer/ic-help-centre.svg')} />
            </div>
            <div id='topbar-fullscreen'>
                <img src={it.url_for('images/pages/footer/ic-fullscreen.svg')} />
            </div>
        </div>
    </div>
);

const Layout = () => {
    if (it.is_pjax_request) {
        return <InnerContent />;
    }

    return (
        <html>
            <Head />
            <body className={it.language} >
                <Gtm />
                <div id='msg_notification' className='notice-msg center-text' />
                <div id='page-wrapper'>
                    <Header />
                    <div id='content-holder'>
                        {/* <MobileMenu /> */}
                        {/* <a href='javascript:;' id='scrollup' /> */}
                        <InnerContent />
                    </div>
                    {/* <Footer /> */}
                    <Topbar />
                </div>
                <InterviewPopup /> {/* TODO: remove when UX research is finished */}
                <LiveChat />
                <DerivIFrame />
                {/* <Elevio /> */}
                <LanguageMenuModal />
            </body>
        </html>
    );
};

export default Layout;
