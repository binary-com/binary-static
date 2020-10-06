import React from 'react';
import DerivTnc from './tac_sections/deriv-tnc.jsx';

const Section = ({
    id = '',
    link_id,
    className = '',
    children,
    sectionNum,
}) => (
    <div id={id} className={`section ${className}`}>
        <a id={link_id} />
        <div className='section-content'>
            <div id={`section-${sectionNum}`}>{children}</div>
        </div>
    </div>
);

const TermsAndConditions = () => (
    <div className='tac-binary gr-row'>
        <div className='gr-12 gr-12-m gr-parent'>
            <Section sectionNum='1' link_id='deriv-tnc'>
                <DerivTnc />
            </Section>
        </div>
    </div>
);

export default TermsAndConditions;
