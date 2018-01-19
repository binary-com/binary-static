import React from 'react';

const ServiceAnnouncements = () => (
    <React.Fragment>
        <div className='gr-parent gr-padding-30 static_full'>
            <h1>{it.L('{JAPAN ONLY}Japan Service Announcements')}</h1>
        </div>

        <div className='gr-parent gr-padding-10'>
            <h2>{it.L('{JAPAN ONLY}JSA_Title_1')}</h2>
            <p><strong>{it.L('{JAPAN ONLY}JSA_Date_1')}</strong></p>
            <p>{it.L('{JAPAN ONLY}JSA_Explanation_1_1)')}</p>
            <p>{it.L('{JAPAN ONLY}JSA_Explanation_1_2)')}</p>

        </div>

        <div className='gr-parent gr-padding-10'>
            <h2>{it.L('{JAPAN ONLY}JSA_Title_2')}</h2>
            <p><strong>{it.L('{JAPAN ONLY}JSA_Date_2')}</strong></p>
            <p>{it.L('{JAPAN ONLY}JSA_Explanation_2_1)')}</p>
            <p>{it.L('{JAPAN ONLY}JSA_Explanation_2_2)')}</p>
            <p>{it.L('{JAPAN ONLY}JSA_Explanation_2_3)')}</p>

        </div>

        <p>{it.L('{JAPAN ONLY}If you need more information then please contact Customer Support at <a href=\'mailto:[_1]\'>[_1]</a>).', 'support@binary.com')}</p>
    </React.Fragment>
);

export default ServiceAnnouncements;
