import React from 'react';
import Explanation from './explanation.jsx';
import LastDigit from './last_digit.jsx';
import Portfolio from '../../user/portfolio.jsx';
import { TabContainer, Tabs, TabContentContainer, TabContent } from '../../../_common/components/tabs.jsx';

const Analysis = () => (
    <div id='trading_analysis_content'>
        <TabContainer className='page-section'>
            <Tabs
                id='analysis_tab_container'
                id_ul='analysis_tabs'
                arr_tabs={[
                    { text: it.L('Chart'),            id: 'tab_graph' },
                    { text: it.L('Portfolio'),        id: 'tab_portfolio',     className: 'invisible' },
                    { text: it.L('Explanation'),      id: 'tab_explanation' },
                    { text: it.L('Last Digit Stats'), id: 'tab_last_digit',    className: 'invisible', no_href: true },
                ]}
            />

            <TabContentContainer id='analysis_content'>
                <TabContent id='tab_graph'>
                    <p className='error-msg' id='chart-error'></p>
                    <div id='trade_live_chart'>
                        <div id='webtrader_chart'></div>
                    </div>
                </TabContent>

                <TabContent id='tab_portfolio'>
                    <Portfolio />
                </TabContent>

                <TabContent id='tab_explanation' className='selectedTab'>
                    <Explanation />
                </TabContent>

                <TabContent id='tab_last_digit'>
                    <LastDigit />
                </TabContent>
            </TabContentContainer>
        </TabContainer>
    </div>
);

export default Analysis;
