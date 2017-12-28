import React from 'react';
import Gtm from '../../_common/includes/gtm.jsx';
import Title from '../../_common/components/title.jsx';
import Head from './head.jsx';
import Header from './header.jsx';
import MainMenu from './main_menu.jsx';
import MobileMenu from './mobile_menu.jsx';
import Footer from './footer.jsx';
import SignupTour from '../get_started/signup_tour.jsx';

const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

const Nav = ({items}) => (
    <ul className='nav'>
        {items.map((item, inx) => (
            <li key={inx}>
                <a href={it.url_for(`get-started/${item.section}`)}>{item.text}</a>
            </li>
        ))}
    </ul>
);

const GetStarted = () => (
    <React.Fragment>
        <div className='get-started static_full'>
            <div className='gr-row'>
                <div className='gr-3 gr-hide-m'>
                    <div className='sidebar'>
                        <Nav
                            items={[
                                { section: 'what-is-binary-trading', text: it.L('Why choose binary trading?') },
                                { section: 'types-of-trades',        text: it.L('Types of trades') },
                                { section: 'binary-options-basics',  text: it.L('Binary options basics') },
                                { section: 'why-trade-with-us',      text: it.L('Why trade with [_1]', it.website_name) },
                                { section: 'how-to-trade-binaries',  text: it.L('How to trade binary options?') },
                                { section: 'volidx-markets',         text: it.L('How to trade the Volatility Indices markets?') },
                                { section: 'smart-indices',          text: it.L('Smart Markets') },
                                { section: 'otc-indices-stocks',     text: it.L('OTC Indices and Stocks') },
                                { section: 'beginners-faq',          text: it.L('FAQ') },
                                { section: 'glossary',               text: it.L('Glossary') },
                            ]}
                        />
                    </div>
                </div>

                <div className='gr-6 gr-12-m gr-parent'>
                    {CONTENT_PLACEHOLDER}
                </div>

                <SignupTour />
            </div>
        </div>
    </React.Fragment>
);

const WithLayout = ({ children }) => {
    const className = `${it.current_route || ''}-content`;
    return (
        <div id='content' className={it.current_route ? className : undefined}>
            <div id='page_info' style={{display: 'none'}}>
                <Title />
                <div id='content_class'>{className}</div>
            </div>
            { it.layout !== 'full_width' ?
                <div className='container'>
                    {children}
                </div> :
                children
            }
        </div>
    );
};

const InnerContent = () => {
    const content = it.layout === 'get_started'  ?
            <GetStarted /> : CONTENT_PLACEHOLDER;

    if (it.layout) {
        return (
            <WithLayout>
                {content}
            </WithLayout>
        );
    }
    return content;
};

const Layout = () => {
    if (it.is_pjax_request) {
        return <InnerContent />;
    }
    return (
        <React.Fragment>
            <html>
                <Head />
                <body className={it.language} >
                    <div id='msg_notification' className='notice-msg center-text'></div>
                    <div id='page-wrapper'>
                        <Header />
                        <div id='content-holder'>
                            <MainMenu />
                            <MobileMenu />
                            <Gtm />
                            <a href='javascript:;' id='scrollup'></a>
                            <InnerContent />
                        </div>
                        <Footer />
                    </div>
                </body>
            </html>
        </React.Fragment>
    );
};

export default Layout;
