import React from 'react';
import { Section, HeaderSecondary, NavButtons, ListStrong } from '../get_started/common.jsx';
import { List } from '../../_common/components/elements.jsx';

const FAQ = () => (
    <div className='static_full'>
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
