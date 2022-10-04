import React from 'react';
import Head from './head.jsx';
import Header from './header.jsx';
import MobileMenu from './mobile_menu.jsx';
import Footer from './footer.jsx';
import InterviewPopup from '../components/interview_popup.jsx';
import Title from '../components/title.jsx';
import Elevio from '../includes/elevio.jsx';
import LiveChat from '../includes/livechat.jsx';
import GamingClosePopupIom from '../components/gaming_close_popup_iom.jsx';
import GamingClosePopup from '../components/gaming_close_popup.jsx';
import GameCloseBanner from '../components/game_close_banner.jsx';
import GameCloseBannerIom from '../components/game_close_banner_iom.jsx';
import EuCloseBanner from '../components/eu_close_banner.jsx';
import EuClosePopup from '../components/eu_close_popup.jsx';
import WarningScamMessage from '../../app/user/warning_scam_message.jsx';
import RedirectBanner from '../components/EU_UK_redirect_banner.jsx';

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

const Layout = () => {
    if (it.is_pjax_request) {
        return <InnerContent />;
    }

    return (
        <html>
            <Head />
            <body className={it.language}>
                <div id='redirect-loading' className='redirect-loader' />
                <div id='msg_notification' className='notice-msg center-text' />
                <div id='page-wrapper'>
                    <Header />
                    <div id='content-holder'>
                        <MobileMenu />
                        <a href='javascript:;' id='scrollup' />
                        <GameCloseBanner />
                        <GameCloseBannerIom />
                        <EuCloseBanner />
                        <EuClosePopup />
                        <RedirectBanner />
                        <InnerContent />
                    </div>
                    <Footer />
                </div>
                <InterviewPopup /> {/* TODO: remove when UX research is finished */}
                <Elevio />
                <LiveChat />
                <GamingClosePopup />
                <GamingClosePopupIom />
                <WarningScamMessage />
            </body>
        </html>
    );
};

export default Layout;
