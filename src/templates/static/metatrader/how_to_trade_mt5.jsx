import React from 'react';
import Forex from './how_to_trade_mt5/forex.jsx';
import Metals from './how_to_trade_mt5/metals.jsx';
import VolatilityIndices from './how_to_trade_mt5/volatility_indices.jsx';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../../_common/components/tabs.jsx';

const HowToTradeMT5 = () => (
    <div id='how_to_trade_mt5' className='static_full'>
        <h1>{it.L('How to Trade in MetaTrader 5')}</h1>
        <TabContainer className='gr-padding-30 gr-parent full-width' theme='light full-width'>
            <TabsSubtabs
                id='how_to_tabs'
                className='tab-selector-wrapper'
                items={[
                    { id: 'forex',                text: it.L('Forex') },
                    { id: 'volatility',           text: it.L('Volatility Indices') },
                    { id: 'metals',               text: it.L('Metals') },
                    { id: 'how_to_tabs_selector', className: 'tab-selector' },
                ]}
            />
            <div className='tab-content'>
                <TabContentContainer>
                    <TabContent id='forex'>
                        <Forex />
                    </TabContent>
                    <TabContent id='volatility'>
                        <VolatilityIndices />
                    </TabContent>
                    <TabContent id='metals'>
                        <Metals />
                    </TabContent>
                </TabContentContainer>
            </div>
        </TabContainer>
    </div>
);

export default HowToTradeMT5;
