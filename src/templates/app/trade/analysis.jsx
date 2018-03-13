import React from 'react';
import Explanation from './explanation.jsx';
import LastDigit from './last_digit.jsx';
import { TabContainer, Tabs, TabContentContainer, TabContent } from '../../_common/components/tabs.jsx';

const Analysis = ({ no_graph }) => (
    <div id='trading_bottom_content'>
        <TabContainer className='page-section'>
            <Tabs
                id_ul='betsBottomPage'
                arr_tabs={[
                    { id: 'tab_portfolio',     className: 'invisible' },
                    { id: 'tab_graph',         disabled: no_graph },
                    { id: 'tab_explanation' },
                    { id: 'tab_last_digit',    className: 'invisible', no_href: true },
                ]}
            />
        </TabContainer>
        <TabContentContainer id='bet_bottom_content'>
            <TabContent id='tab_portfolio' />

            { !no_graph &&
            <TabContent id='tab_graph'>
                <p className='error-msg' id='chart-error' />
                <div id='trade_live_chart'>
                    <div id='webtrader_chart' />
                </div>
            </TabContent>
            }

            <TabContent id='tab_explanation' className='selectedTab'>
                <Explanation />
            </TabContent>

            <TabContent id='tab_last_digit'>
                <LastDigit />
            </TabContent>
        </TabContentContainer>
    </div>
);

export default Analysis;
