import React from 'react';
import { Tbody } from '../../_common/components/elements.jsx';

const Info = ({ header, text, doc }) => (
    <div className='gr-parent gr-padding-10'>
        <h2>{header}</h2>
        <p>{text}</p>
        <ul className='bullet'>
            <li>
                <a href={`${it.japan_docs_url}/documents/${doc}.pdf`} target='_blank' download>{it.L('{JAPAN ONLY}Download our latest report here')}</a>
            </li>
        </ul>
    </div>
);

const CompanyProfile = () => {
    const trs = [
        [{ text: it.L('{JAPAN ONLY}Company name') },                               { text: it.L('{JAPAN ONLY}Binary K. K.') }],
        [{ text: it.L('{JAPAN ONLY}Company name in English') },                    { text: 'Binary K. K.' }],
        [{ text: it.L('{JAPAN ONLY}Registration') },                               { text: it.L('{JAPAN ONLY}Financial Instruments Business No. xxxx') }],
        [{ text: it.L('Address') },                                                { text: it.L('{JAPAN ONLY}HirooMiyaya 3F, 1-9-16 Hiroo, Shibuya, Tokyo, 150-0012') }],
        [{ text: it.L('{JAPAN ONLY}Establishment') },                              { text: it.L('{JAPAN ONLY}November 7, 2014') }],
        [{ text: it.L('{JAPAN ONLY}Capital') },                                    { text: it.L('{JAPAN ONLY}80,100,000 JPY (as of September 20, 2016)') }],
        [{ text: it.L('{JAPAN ONLY}Association of join') },                        { text: it.L('{JAPAN ONLY}The Financial Futures Association of Japan') }],
        [{ text: it.L('{JAPAN ONLY}Designated dispute resolution organization') }, { text: it.L('{JAPAN ONLY}Financial Instruments Mediation Assistance Center') }],
        [{ text: it.L('{JAPAN ONLY}Main business') },                              { text: it.L('{JAPAN ONLY}Type I Financial Instruments Business based on the Financial Instruments and Exchange Law') }],
    ];

    return (
        <React.Fragment>
            <div className='gr-parent gr-padding-30 static_full'>
                <h1>{it.L('{JAPAN ONLY}Company Profile')}</h1>
                <table>
                    <Tbody trs={trs} />
                </table>
            </div>

            <Info
                header={it.L('{JAPAN ONLY}Capital Adequacy Ratio (CAR)')}
                text={it.L('{JAPAN ONLY}Disclosure of CAR by No. 46-6-3 in the FIEA (Financial Instruments and Exchange Act)')}
                doc='binary_report_capital_adequacy'
            />
            <Info
                header={it.L('{JAPAN ONLY}Win Loss Ratio')}
                text={it.L('{JAPAN ONLY}Disclosure of win loss ratio by No. xx in the FIEA')}
                doc='binary_report_ratios'
            />
            <Info
                header={it.L('{JAPAN ONLY}Financial Condition')}
                text={it.L('{JAPAN ONLY}Disclosure of financial statement by No. xx in the FIEA')}
                doc='binary_disclosure'
            />
        </React.Fragment>
    );
};

export default CompanyProfile;
