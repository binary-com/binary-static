import React from 'react';
import Explanation from './explanation.jsx';
import LastDigit from './last_digit.jsx';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../../_common/components/tabs.jsx';

const Analysis = ({ no_graph }) => (
    <div id='trading_bottom_content'>
        <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
            <TabsSubtabs
                id='trade_analysis'
                className='gr-padding-20 gr-parent tab-selector-wrapper'
                items={[
                    { id: 'tab_portfolio',     className: 'invisible' , text: it.L('Portfolio') },
                    { id: 'tab_graph',         disabled: no_graph, text: it.L('Chart') },
                    { id: 'tab_explanation', text: it.L('Explanation') },
                    { id: 'tab_last_digit',    className: 'invisible', no_href: true, text: it.L('Last Digit Stats') },
                    { id: 'trade_analysis_selector', className: 'tab-selector' },
                ]}
            />
            <div className='tab-content'>
                <TabContentContainer id='analysis_content'>
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
        </TabContainer>
    </div>
);

export default Analysis;
