import React              from 'react';

import Hero               from './affiliate_ib_landing/hero.jsx';
import Statistics         from './affiliate_ib_landing/statistics.jsx';
import TypesOfPartnership from './affiliate_ib_landing/type_of_partnership.jsx';
import HowItWorks         from './affiliate_ib_landing/how_it_works.jsx';
import WhoCanApply        from './affiliate_ib_landing/who_can_apply.jsx';
import WhyPartner         from './affiliate_ib_landing/why_partner.jsx';
import FAQ                from './affiliate_ib_landing/faq.jsx';
import Payment            from './affiliate_ib_landing/payment.jsx';

const AffiliateIBLanding = () => (
    <React.Fragment>
        <Hero />
        <Statistics />
        <TypesOfPartnership />
        <HowItWorks />
        <WhoCanApply />
        <WhyPartner />
        <FAQ />
        <Payment />
    </React.Fragment>
);

export default AffiliateIBLanding;
