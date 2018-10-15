import React from 'react';
import TermsAndConditions from './terms_and_conditions';
import Contract from './contract';
import AccountPrivacy from './account_privacy';
import AccountAntisocial from './account_antisocial';
import AccountRisk from './account_risk';
import AccountWarning from './account_warning';
import EthicsCode from './ethics_code';
import EthicsAntisocial from './ethics_antisocial';
import EthicsSolicitation from './ethics_solicitation';
import EthicsLiability from './ethics_liability';
import Affiliates from './affiliates';
import { TabContainer, TabsSubtabs, TabContentContainer, TabContent } from '../../../_common/components/tabs';

const TAC = () => (
    <div className='invisible ja-show'>
        <TabContainer className='static_full tab-with-subsection' >
            <TabsSubtabs
                className='static_full'
                id='legal-menu'
                items={[
                    { id: 'legal',      text: it.L('{JAPAN ONLY}Terms and Conditions')  }  ,
                    { id: 'contract',   text: it.L('{JAPAN ONLY}Pre-contract Document') }  ,
                    {
                        id     : 'account',
                        text   : it.L('{JAPAN ONLY}Account Opening'),
                        subtabs: [
                            { id: 'account-privacy',    text: it.L('{JAPAN ONLY}Privacy Policy') }  ,
                            { id: 'account-antisocial', text: it.L('{JAPAN ONLY}No Connections with Antisocial Forces') }  ,
                            { id: 'account-risk',       text: it.L('{JAPAN ONLY}Risk for Binary Option Trading') }  ,
                            { id: 'account-warning',    text: it.L('{JAPAN ONLY}General Risk Warning') }  ,
                        ],
                    },
                    {
                        id     : 'ethics',
                        text   : it.L('{JAPAN ONLY}Policies and Exclusion of Liability'),
                        subtabs: [
                            { id: 'ethics-code',         text: it.L('{JAPAN ONLY}Ethics Code') }  ,
                            { id: 'ethics-antisocial',   text: it.L('{JAPAN ONLY}Eliminating Antisocial Forces') }  ,
                            { id: 'ethics-solicitation', text: it.L('{JAPAN ONLY}Investment Solicitation Policy') }  ,
                            { id: 'ethics-liability',    text: it.L('{JAPAN ONLY}Exclusion of Liability') }  ,
                        ],
                    },
                    { id: 'affiliates', text: it.L('{JAPAN ONLY}Affiliates Program') },
                ]}
            />
            <div className='tab-content'>
                <TabContentContainer>
                    <TabContent  id='legal' >
                        <TermsAndConditions />
                    </TabContent>
                    <TabContent  id='contract' >
                        <Contract />
                    </TabContent>

                    <TabContent  id='account-privacy' >
                        <AccountPrivacy />
                    </TabContent>
                    <TabContent  id='account-antisocial' >
                        <AccountAntisocial />
                    </TabContent>
                    <TabContent  id='account-risk' >
                        <AccountRisk />
                    </TabContent>
                    <TabContent  id='account-warning' >
                        <AccountWarning />
                    </TabContent>

                    <TabContent  id='ethics-code' >
                        <EthicsCode />
                    </TabContent>
                    <TabContent  id='ethics-antisocial' >
                        <EthicsAntisocial />
                    </TabContent>
                    <TabContent  id='ethics-solicitation' >
                        <EthicsSolicitation />
                    </TabContent>
                    <TabContent  id='ethics-liability' >
                        <EthicsLiability />
                    </TabContent>

                    <TabContent  id='affiliates' >
                        <Affiliates />
                    </TabContent>
                </TabContentContainer>
            </div>
        </TabContainer>
    </div>
);

export default TAC;
