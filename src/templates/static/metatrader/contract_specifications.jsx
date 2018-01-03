import React from 'react';
import Forex from './contract_specifications/forex.jsx';
import Metals from './contract_specifications/metals.jsx';
import VolatilityIndices from './contract_specifications/volatility_indices.jsx';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../../_common/components/tabs.jsx';

const ContractSpecifications = () => (
    <div className='static_full'>
        <h1>{it.L('Contract Specifications')}</h1>
        <TabContainer className='cs-content' theme='light full-width'>
            <TabsSubtabs
                id='cs_tabs'
                className='tab-selector-wrapper'
                items={[
                    { id: 'forex',            text: it.L('Forex') },
                    { id: 'volatility',       text: it.L('Volatility Indices') },
                    { id: 'metals',           text: it.L('Metals') },
                    { id: 'cs_tabs_selector', className: 'tab-selector' },
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

export default ContractSpecifications;
