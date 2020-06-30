import React             from 'react';
import { FillBox }       from '../../_common/components/elements.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const TimelineFirst = () => (
    <div className='gr-1 gr-2-m gr-centered'>
        <img className='responsive' src={it.url_for('images/pages/regulation/timeline.svg')} />
    </div>
);

const TimelineMid = () => (
    <React.Fragment>
        <div className='gray-line' />
        <TimelineFirst />
    </React.Fragment>
);

const Box = ({
    first,
    last,
    header,
    children,
}) => (
    <React.Fragment>
        {first ? <TimelineFirst /> : undefined}
        <div className='background-gray fill-bg-color center-text gr-padding-30 gr-12'>
            <div className='gr-12 gr-padding-30'>
                <h1>{header}</h1>
                {children}
            </div>
        </div>
        {last ? undefined : <TimelineMid />}
    </React.Fragment>
);

const RegulatorImage = ({
    padding,
    padding_m,
    href,
    image,
}) => (
    <div className={`gr-${padding || 3} gr-${padding_m || 4}-m gr-centered`}>
        <a href={href} target='_blank' rel='noopener noreferrer'>
            <img className='responsive' src={it.url_for(image)} />
        </a>
    </div>
);

const RegulatorText = () => (
    <p>
        <strong>{it.L('Regulator:')}</strong>
    </p>
);

const Area = ({ items }) => {
    const square_wh = 10.6;
    const default_width = 37.8;
    const svg_width = 300;
    const svg_scale = 900 / svg_width;
    const normalize = n => n.toFixed(2);
    return (
        <React.Fragment>
            {items.map((item, idx) =>(
                <area
                    shape='rect'
                    coords={`${normalize(item.x * svg_scale)},${normalize(item.y * svg_scale)},${normalize((item.x + (item.width || default_width) + square_wh) * svg_scale)},${normalize((item.y + square_wh) * svg_scale)}`}
                    href={item.link || it.url_for(`download/regulation/${item.name.replace(' ', '')}.pdf`)}
                    alt={item.name}
                    key={idx}
                    target='_blank'
                    rel='noopener noreferrer'
                />
            ))}
        </React.Fragment>
    );
};

const Regulation = () => {
    const has_KID    = /de|en|es|it|fr|pl|pt|ru/.test(`${it.language.toLowerCase()}`);
    const has_CFD_FX = !/fr/.test(it.language.toLowerCase()); // CFD, FX documents in FR will not be available
    const lang       = has_KID && has_CFD_FX ? `${it.language.toLowerCase()}` : 'en';

    return (
        <div className='static_full'>
            <h1 className='center-text'>{it.L('Regulatory Information')}</h1>
            <div className='gr-parent gr-padding-30'>
                <p className='center-text'>{it.L('[_1] is a licensed and regulated trading platform that serves over 1,000,000 customers globally. We hold multiple licenses to comply with regulations around the world. Since 1999, we\'ve served our clients with a constant and unwavering commitment to integrity and reliability. We always hold ourselves to the highest ethical standards, in addition to our regulatory requirements.', it.website_name)}</p>

                <SeparatorLine className='gr-parent gr-padding-20' invisible />
            </div>

            <Box header={it.L('Deriv Limited')} first>
                <p>{it.L('Deriv Limited, with registered office at 47 Esplanade, St Helier, Jersey JE1 0BD, Channel Islands, is the holding company for the subsidiaries listed below.')}</p>
            </Box>

            <Box header={it.L('Deriv Investments (Europe) Ltd')} >
                <p>{it.L('Deriv Investments (Europe) Ltd, W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta. Licensed and regulated as a Category 3 Investment Services provider by the Malta Financial Services Authority ([_1]licence no. IS/70156[_2]).',`<a href="${it.url_for('/download/WS-Deriv-Investments-Europe-Limited.pdf')}" target="_blank">`, '</a>')}</p>
                <p>{it.L('European Union residents who wish to trade investment products will have their accounts opened with Deriv Investments (Europe) Ltd.')}</p>
                <div className='gr-padding-30 gr-12' id='accordion'>
                    <h3 aria-expanded='true' aria-selected='true'>{it.L('EU Passport Rights')}</h3>
                    <div>
                        <p>{it.L('Deriv Investments (Europe) Limited is entitled to provide services in another EU Member State through EU passporting rights. Refer to the map below for the list of EU countries that have access to [_1] via EU passporting rights - freedom to provide cross border services.', it.website_name)}</p>
                        <div className='center-text gr-padding-10 gr-12'>
                            <img className='responsive' src={it.url_for('images/pages/regulation/map.svg')} useMap='#planetmap' />
                        </div>
                        <map name='planetmap' id='planetmap'>
                            <Area
                                items={[
                                    { name: 'Sweden',         x: 105.561, y: 13.568 },
                                    { name: 'Denmark',        x: 102.461, y: 25.638 },
                                    { name: 'Germany',        x: 94.944,  y: 37.872 },
                                    { name: 'Netherlands',    x: 79.061,  y: 50.038,  width: 46.2 },
                                    { name: 'United Kingdom', x: 0.461,   y: 102.368, width: 55.7 },
                                    { name: 'Luxembourg',     x: 0,       y: 114.931, width: 46.9 },
                                    { name: 'France',         x: 0.434,   y: 136.647 },
                                    { name: 'Spain',          x: 0.25,    y: 152.315 },
                                    { name: 'Italy',          x: 0.184,   y: 164.056, width: 27.3 },
                                    { name: 'Portugal',       x: 0.25,    y: 178.256 },
                                    { name: 'Austria',        x: 108.926, y: 179.94 },
                                    { name: 'Slovenia',       x: 100.733, y: 205.64 },
                                    { name: 'Croatia',        x: 167.224, y: 212.34 },
                                    { name: 'Greece',         x: 187.154, y: 193.083 },
                                    { name: 'Cyprus',         x: 245,     y: 219,     width: (48.4 - 10.6) },
                                    { name: 'Bulgaria',       x: 253,     y: 145.5,   width: (48.4 - 10.6) },
                                    { name: 'Romania',        x: 251.6,   y: 133.59 },
                                    { name: 'Hungary',        x: 254.2,   y: 122 },
                                    { name: 'Slovakia',       x: 251.6,   y: 110.279 },
                                    { name: 'Czech Republic', x: 236.2,   y: 97.306,  width: 53.2 },
                                    { name: 'Poland',         x: 255.3,   y: 83.549,  width: 34.2 },
                                    { name: 'Lithuania',      x: 250.348, y: 68.383,  width: 39.3 },
                                    { name: 'Latvia',         x: 255.321, y: 53.293,  width: 34.2 },
                                    { name: 'Estonia',        x: 255.3,   y: 38.361,  width: 34.2 },
                                    { name: 'Finland',        x: 247.873, y: 13.568,  width: 34.2 },
                                ]}
                            />
                        </map>
                    </div>

                    <h3>{it.L('Pillar 3 Disclosures')}</h3>
                    <div>
                        <p>{it.L('The Pillar 3 disclosure report of Deriv Investments (Europe) Limited has been prepared in accordance with the Capital Requirements Directive IV and the Capital Requirements Regulation. Read our Pillar 3 disclosure report to understand how we comply with market discipline as a market participant.')}</p>
                        <FillBox
                            padding='5'
                            center
                            border='border-dark-gray'
                            image='images/pages/regulation/pdf-icon.svg'
                            href={it.url_for('/download/BIEL_Pillar_3_Report_20200421.pdf')}
                            target='_blank'
                            text={it.L('Pillar 3 disclosure report')}
                        />
                    </div>

                    <h3 id='key_information_documents' href='#key_information_documents'>{it.L('Key Information Documents')}</h3>
                    <div>
                        <p>{it.L('These documents provide you with key information about our investment products. This information is required by law to help you understand the nature, risks, costs, potential gains and losses of these products and to help you compare them with other products.')}</p>
                        <div className='gr-row'>
                            <FillBox id='crypto_fillbox' padding='4' center border='border-dark-gray' href={it.url_for(`/download/key_information_document/${lang}/Crypto.pdf`)} target='_blank' text={it.L('Cryptocurrencies')} />
                            <FillBox id='cfd_fillbox' padding='4' center className='margin-right-0' border='border-dark-gray' href={it.url_for(`/download/key_information_document/${lang}/Commodities.pdf`)} target='_blank' text={it.L('Commodities')} />
                            <FillBox id='fx_fillbox' padding='4' center className='margin-left-0'  border='border-dark-gray' href={it.url_for(`/download/key_information_document/${lang}/Forex.pdf`)} target='_blank' text={it.L('Forex')} />
                        </div>
                    </div>

                    <h3>{it.L('RTS 28')}</h3>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/pdf-icon.svg'
                                href={it.url_for('/download/BIEL-RTS28-for-2018.pdf')}
                                target='_blank'
                                text={it.L('BIEL RTS28 for 2018')}
                            />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/pdf-icon.svg'
                                href={it.url_for('/download/BIEL-RTS28-for-2019.pdf')}
                                target='_blank'
                                text={it.L('BIEL RTS28 for 2019')}
                            />
                        </div>
                    </div>

                    <h3>{it.L('RTS 27 2020')}</h3>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m gr-padding-30 gr-centered'>
                            <h3>{it.L('Q1 2020')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2020/Q1/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2020/Q1/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2020/Q1/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2020/Q1/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                    </div>

                    <h3>{it.L('RTS 27 2019')}</h3>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q1 2019')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q1/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q1/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q1/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q1/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q2 2019')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q2/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q2/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q2/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q2/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q3 2019')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q3/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q3/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q3/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q3/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q4 2019')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q4/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q4/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q4/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2019/Q4/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                    </div>

                    <h3>{it.L('RTS 27 2018')}</h3>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q3 2018')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q3/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q3/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q3/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q3/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                        <div className='gr-6 gr-12-m gr-padding-30'>
                            <h3>{it.L('Q4 2018')}</h3>
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q4/Table_1.xlsx')}
                                target='_blank'
                                text={it.L('Table 1 - Type of execution venue')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q4/Table_3.xlsx')}
                                target='_blank'
                                text={it.L('Table 3 - Intra-Day Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q4/Table_4.xlsx')}
                                target='_blank'
                                text={it.L('Table 4 - Daily Price information')}
                            />
                            <FillBox
                                align_left
                                center
                                border='border-dark-gray'
                                className='margin-top-17 align-start'
                                image='images/pages/regulation/xlsx-icon.svg'
                                href={it.url_for('/download/rts27_2018/Q4/Table_6.xlsx')}
                                target='_blank'
                                text={it.L('Table 6 - Likelihood of execution information')}
                            />
                        </div>
                    </div>
                </div>
            </Box>

            <div data-show='eucountry'>
                <Box header={it.L('Binary (Europe) Limited')} >
                    <p>{it.L('Binary (Europe) Limited, W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta. Licensed and regulated (for gambling products only - [_1]\'s Synthetic Indices) by the Malta Gaming Authority in Malta  (licence no. [_2]) - [_3]view licence[_4] and also maintains an Irish licence. For UK clients by the UK Gambling Commission - [_5]view licence[_4].', it.website_name, 'MGA/B2C/102/2000', `<a href="${it.url_for('download/regulation/MGA_licence.pdf')}" target="_blank">`, '</a>', '<a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39495" target="_blank">')}</p>
                    <p>{it.L('European Union residents who wish to trade gambling products will have their accounts opened with Binary (Europe) Limited.')}</p>
                    <RegulatorText />
                    <RegulatorImage padding='4' padding_m='8' href='http://www.mga.org.mt/' image='images/pages/why-us/mga-logo2.svg' />
                </Box>

                <Box header={it.L('Deriv (MX) Limited')} >
                    <p>{it.L('Deriv (MX) Limited, First Floor, Millennium House, Victoria Road, Douglas, Isle of Man, IM2 4RW. Licensed and regulated by the Gambling Supervision Commission in the Isle of Man (current online gambling licence granted on the 31 August 2017) - [_1]view licence[_2] and for UK clients by the UK Gambling Commission - [_3]view licence[_2].', `<a href=${it.url_for('download/regulation/IOMGSC_Licence.pdf')} target="_blank">`, '</a>', '<a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39172" target="_blank">')}</p>
                    <p>{it.L('UK and Manx residents who wish to trade gambling products will have their accounts opened with Deriv (MX) Limited.')}</p>
                    <RegulatorText />
                    <RegulatorImage href='https://www.gov.im/gambling/' image='images/pages/regulation/isle-of-man.png' />
                </Box>
            </div>

            <Box header={it.L('Deriv (SVG) LLC')} >
                <p>{it.L('Deriv (SVG) LLC, Hinds Buildings, Kingstown, St. Vincent and the Grenadines; company number 25299 BC 2019.')}</p>
                <p>{it.L('Clients from the rest of the world (excluding certain countries such as the USA, Canada, and Hong Kong) will have their account opened with Deriv (SVG) LLC.')}</p>
            </Box>

            <Box header={it.L('Deriv (V) Ltd')} >
                <p>{it.L('Deriv (V) Ltd, Govant Building, Port Vila, PO Box 1276, Vanuatu, Republic of Vanuatu. Licensed and regulated by the Vanuatu Financial Services Commission - [_1]view licence[_2].', `<a href=${it.url_for('download/regulation/Vanuatu-license.pdf')} target="_blank">`, '</a>')}</p>
                <p>{it.L('Clients from the rest of the world (excluding certain countries such as the USA, Canada, Hong Kong) will have their FX and CFD Metatrader 5 account opened with Deriv (V) Ltd. [_1] is not available in the Republic of Vanuatu.', it.website_name)}</p>
                <RegulatorText />
                <RegulatorImage href='https://www.vfsc.vu/' image='images/pages/regulation/vanuatu-logo.png' />
            </Box>

            <Box header={it.L('Deriv (BVI) Ltd')} >
                <p>{it.L('Deriv (BVI) Ltd, Kingston Chambers, P.O. Box 173, Road Town, Tortola, British Virgin Islands. Licensed and regulated by the British Virgin Islands Financial Services Commission - [_1]view licence[_2].', `<a href=${it.url_for('download/regulation/BVI_license.pdf')} target="_blank">`, '</a>')}</p>
                <p>{it.L('Clients from the rest of the world (excluding certain countries such as the USA, Canada, Hong Kong) will have their FX and CFD Metatrader 5 account opened with Deriv (BVI) Ltd. [_1] is not available in the British Virgin Islands.', it.website_name)}</p>
                <RegulatorText />
                <RegulatorImage href='http://www.bvifsc.vg/' image='images/pages/regulation/bvi.png' />
            </Box>

            <Box header={it.L('Binary (FX) Ltd')} last>
                <p>{it.L('Binary (FX) Ltd., Lot No. F16, First Floor, Paragon Labuan, Jalan Tun Mustapha, 87000 Federal Territory of Labuan, Malaysia. Licensed and regulated by the Labuan Financial Services Authority to carry on a money-broking business [_1](licence no. MB/18/0024)[_2].', `<a href=${it.url_for('download/regulation/Labuan-license.pdf')} target="_blank">`, '</a>')}</p>
                <p>{it.L('Clients from the rest of the world (excluding certain jurisdictions such as the USA, Canada, and the European Union) who wish to trade CFDs will have their MetaTrader 5 account opened with Binary (FX) Ltd. [_1] is not available in Malaysia.', it.website_name)}</p>
                <RegulatorText />
                <RegulatorImage href='https://www.labuanibfc.com/' image='images/pages/regulation/labuan-logo.png' />
            </Box>
        </div>
    );
};

export default Regulation;
