import React from 'react';

import Gtm from '../../_common/includes/gtm.jsx';
import IcoBanner from '../..//_common/includes/ico_banner.jsx';
import Title from '../../_common/components/title.jsx';
import Head from './head.jsx';
import Header from './header.jsx';
import MainMenu from './main_menu.jsx';
import MobileMenu from './mobile_menu.jsx';
import Footer from './footer.jsx';

const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

const WithLayout = ({ children }) => {
    const content_class = `${it.current_route || ''}-content`;
    const ico_class = `top-margin${  it.layout === 'default' ? ' bottom-margin' : ''}`;
    return (
        <div id="content" className={it.current_route ? content_class : undefined} >
            <IcoBanner container='ico-banner-container'  className={ico_class} />
            <div id="page_info" style={{display: 'none'}}>
                <Title />
                <div id="content_class">{content_class}</div>
            </div>
            {it.layout !== 'full_width' ?
                <div className="container">
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
    if(it.is_pjax_request) {
        return <InnerContent />;
    }
    return (
        <html>
            <Head />
            <body className={it.language} >
                <div id="msg_notification" className="notice-msg center-text"></div>
                <div id='page-wrapper'>
                    <Header />
                    <div id="content-holder">
                        <MainMenu />
                        <MobileMenu />
                        <Gtm />
                        <a href="javascript:;" id="scrollup"></a>
                        <InnerContent />
                    </div>
                    <Footer />
                </div>
            </body>
        </html>
    );
};

export default Layout;