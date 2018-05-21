import React from 'react';
import { FillBox } from '../../_common/components/elements.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const CareersShared = () => (
    <React.Fragment>
        <div className='gr-padding-30'>
            <FillBox
                image='images/pages/careers/view-positions-icon.svg'
                center
                padding='4'
                href={it.url_for('open-positions')}
                text={it.L('View open positions')}
            />
        </div>

        <SeparatorLine />

        <div className='gr-padding-30'>
            <h1>{it.L('Are you ready?')}</h1>
            <p>{it.L('If you are, we\'d love to hear from you.')}</p>
            <p>{it.L('Send us a CV and a covering letter that describes your career interests.')}</p>
            <p>{it.L('If you meet our basic requirements, we\'ll send you a talent test.')}</p>
            <p>{it.L('If we\'re happy with your results, we\'ll contact you for an interview and then do background and reference checks.')}</p>
            <p>{it.L('If all that sounds a bit daunting, you\'re right. But it\'s how we make sure we get the best people for our team.')}</p>

            <p className='center-text'>{it.L('To apply, please submit your CV and a cover letter to [_1].', '<a href="mailto:hr@binary.com" rel="nofollow">hr@binary.com</a>')}</p>
        </div>
    </React.Fragment>
);

export default CareersShared;
