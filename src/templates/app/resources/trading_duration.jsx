import React from 'react';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../../_common/components/tabs.jsx';

const ArrowsMobile = ({ direction, parent }) => (
    <div className='align-self-center gr-2 gr-hide gr-show-m gr-no-gutter'>
        <img
            className={`go-${direction} gr-5 gr-no-gutter gr-centered`}
            data-parent={parent}
            src={it.url_for(`images/pages/home/arrow_${direction}.svg`)}
        />
    </div>
);

const TradingDurations = () => (
    <div id='trading_durations' className='gr-centered gr-12-p gr-12-m trading-durations'>
        <h1 id='trading_durations_title'>{it.L('Trading Durations')}</h1>
        <div id='trading_durations_wrapper' className='gr-padding-20'>
            <div id='trading_durations_content'>
                <TabContainer className='gr-padding-10 full-width' theme='light'>
                    <div className='gr-row gr-padding-20-m'>
                        <ArrowsMobile parent='duration_assets' direction='left' />
                        <strong id='tab_mobile_header' className='align-self-center gr-hide gr-show-m gr-8' />
                        <ArrowsMobile parent='duration_assets' direction='right' />
                    </div>
                    <TabsSubtabs
                        id='duration_assets'
                        className='gr-parent tab-selector-wrapper'
                        items={[
                            { id: 'tab_forex',       text: it.L('Forex'),               className: 'invisible' },
                            { id: 'tab_indices',     text: it.L('Indices'),             className: 'invisible' },
                            { id: 'tab_commodities', text: it.L('Commodities'),         className: 'invisible' },
                            { id: 'tab_volidx',      text: it.L('Volatility Indices'),  className: 'invisible' },
                            { id: 'duration_assets_selector',                           className: 'tab-selector' },
                        ]}
                    />
                    <div className='tab-content gr-padding-20'>
                        <TabContentContainer>
                            <TabContent id='tab_forex' className='selectedTab' />
                            <TabContent id='tab_indices' />
                            <TabContent id='tab_commodities' />
                            <TabContent id='tab_volidx' />
                        </TabContentContainer>
                    </div>
                </TabContainer>

                <div id='trading_durations_loading' />
            </div>
            <p className='notice-msg center-text invisible' id='trading_durations_empty'>
                {it.L('Trading durations is unavailable in this country. If you have an active [_1] account, please [_2]log in[_3] for full access.', it.website_name, '<a id=\'empty-trading-durations-btn-login\' href=\'javascript:;\'>', '</a>')}
            </p>
        </div>
    </div>
);

export default TradingDurations;
