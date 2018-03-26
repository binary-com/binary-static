import React from 'react';
import { Section, HeaderSecondary, NavButtons, ListStrong } from '../get_started/common.jsx';
import { List } from '../../_common/components/elements.jsx';

const FAQ = () => (
    <div className='static_full affiliates_faq'>
        <h1>{it.L('Affiliate FAQ')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'general',                         href: '#general',                         text: it.L('General')},
                            { id: 'account-management-and-tracking', href: '#account-management-and-tracking', text: it.L('Account management and tracking')},
                            { id: 'marketing-and-promotions',        href: '#marketing-and-promotions',        text: it.L('Marketing and promotions')},
                            { id: 'support',                         href: '#support',                         text: it.L('Support')},
                        ]}
                    />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='general' header={it.L('General')}>
                    <h3>{it.L('What is the Binary.com Affiliate Programme all about?')}</h3>
                    <p>{it.L('The Binary.com Affiliate Programme allows you to benefit from referring new clients to our site.')}</p>
                    <p>{it.L('If you\'re a broker we\'d like to work with you. You will be introducing your clients to a unique and innovative product: the Binary.com trading platform. Your clients will love the Binary.com trading platform because we offer a complete binary options trading experience tailored to the needs of an exceptionally wide range of traders.')}</p>
                    <p>{it.L('Novice traders can use our intuitive platform to learn about trading, practise trading, and gain trading experiences. Seasoned traders can use the Binary.com platform and take full advantage of the wide range of trading and analysis tools we have to offer.')}</p>

                    <h3>{it.L('Why should I become a Binary.com affiliate?')}</h3>
                    <p>{it.L('Binary.com is a licensed and regulated binary options trading platform that’s been operating since 2000. It has:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('An international appeal with multilingual support in English, Spanish, French, German, Portuguese, Chinese, Japanese, Italian, Thai, Polish, Russian, and Indonesian')}</li>
                        <li>{it.L('An intuitive, web-based platform that’s instantly available to traders of all levels –– anytime, anywhere')}</li>
                        <li>{it.L('A competitive and flexible affiliate programme that can be adapted to your needs')}</li>
                    </ul>

                    <h3>{it.L('Is there a cost for joining?')}</h3>
                    <p>{it.L('Not at all. Joining our affiliate programme is completely free and always will be.')}</p>

                    <h3>{it.L('What is the definition of a referred client?')}</h3>
                    <p>{it.L('A client is someone who has been referred through your unique affiliate link and who has deposited money into their Binary.com account. They must fulfil the following criteria:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Have not previously been a Binary.com customer')}</li>
                        <li>{it.L('Aged 18 years old and above')}</li>
                    </ul>


                    <h3>{it.L('Who can be a client on the Binary.com platform?')}</h3>
                    <p>{it.L('Anyone aged 18 years old and above who is not the resident of a “restricted country” (as listed in our <a href=\'[_1]\'>Terms & Conditions</a>) can become a Binary.com client.', it.url_for('terms-and-conditions'))}</p>
                </Section>
                <Section id='account-management-and-tracking' header={it.L('Account management and tracking')}>
                </Section>
                <Section id='marketing-and-promotions' header={it.L('Marketing and promotions')}>
                </Section>
                <Section id='support' header={it.L('Support')}>
                </Section>
            </div>
        </div>
    </div>
);

export default FAQ;
