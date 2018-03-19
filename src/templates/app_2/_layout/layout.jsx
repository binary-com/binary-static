import React from 'react';
import Head from './head.jsx';
import Header from './header.jsx';
import GTM from '../../_common/includes/gtm.jsx';
import Title from '../../_common/components/title.jsx';
import Footer from './footer.jsx';

const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

const WithLayout = ({ children }) => {
    const content_class = `${it.current_route || ''}-content`;
    return (
        <div id='content-holder'>
            <div id='content' className={it.current_route ? content_class : undefined}>
                <div id='page_info' style={{display: 'none'}}>
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
        return <div/>;
    }
    return (
        <html>
            <Head />
            <body className={it.language}>
                <Header />
                <GTM />
                <InnerContent />
                <Footer />
            </body>
        </html>
    );
};

export default Layout;
