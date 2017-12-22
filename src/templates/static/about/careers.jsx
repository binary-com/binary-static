import React from 'react';
import CareersShared from '../about/careers_shared.jsx';
import { FillBox } from '../../_common/components/elements.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const ColumnSM = ({ header, paragraph }) => (
    <div className='gr-3 gr-12-m'>
        <h4><strong>{header}</strong></h4>
        <SeparatorLine no_wrapper />
        <p>{paragraph}</p>
    </div>
);

const ColumnMD = ({ header, paragraph }) => (
    <div className='gr-4 gr-12-m'>
        <h2>{header}</h2>
        <p>{paragraph}</p>
    </div>
);

const ColumnLG = ({ center, image, text }) => (
    <div className={`gr-6 gr-12-m${center ? ' center-text' : ''}`}>
        <img className='responsive' src={it.url_for(`images/pages/careers/${image}.jpg`)} />
        <p className={center ? 'gr-padding-10 hint' : undefined}>{text}</p>
    </div>
);

const Careers = () => (
    <div className='static_full career'>
        <div className='container'>
            <div className='center-text'>
                <h1>{it.L('Imagine')}</h1>
                <p>{it.L('Imagine a workplace where your individuality, creativity and sense of adventure are valued and rewarded.')}</p>
            </div>

            <div className='gr-padding-30'>
                <img className='responsive' src={it.url_for('images/pages/careers/main@1.jpg')} />
                <FillBox
                    image='images/pages/careers/view-positions-icon-white.svg'
                    color='dark'
                    no_padding
                    href={it.url_for('open-positions')} text={it.L('View open positions')}
                />
            </div>

            <div className='gr-row gr-padding-30'>
                <ColumnSM header={it.L('Ideas')}      paragraph={it.L('Where new ideas trump safe, old ones. And you\'re free to work your way, free from hierarchies and red tape.')} />
                <ColumnSM header={it.L('Experience')} paragraph={it.L('Where your experience, drive and talent can propel you in unknown directions. And you have the freedom to push into new frontiers.')} />
                <ColumnSM header={it.L('Teamwork')}   paragraph={it.L('Where teamwork and a collaborative culture form the platform for personal and corporate growth.')} />
                <ColumnSM header={it.L('Support')}    paragraph={it.L('Where supportive colleagues are like a second family.')} />
            </div>

            <div className='gr-row center-text'>
                <FillBox
                    image='images/pages/careers/corporate-culture.svg'
                    href='https://my.wobb.co/users/companies/binary-group-services-sdn-bhd'
                    text={it.L('Learn more about our corporate culture')}
                    padding='6'
                    target='_blank'
                />

                <FillBox
                    image='images/pages/careers/handbook.svg'
                    href={it.url_for('download/binary-employee-handbook.pdf')}
                    download
                    text={it.L('Employee handbook')}
                    padding='6'
                    target='_blank'
                />
            </div>

            <div className='gr-row gr-padding-30'>
                <ColumnLG center image='fsb@1' text={it.L('Imagine a workplace that often doesn\'t feel like work.')} />
                <ColumnLG center image='pt@1'  text={it.L('Where we\'re one big, multicultural family.')} />

                <div className='container'>
                    <p>{it.L('And your weekends can take you to some of the world\'s most exotic and beautiful places.')}</p>
                    <p>{it.L('But we\'re picky. We only select people with special qualities: serious professionals, who have high moral standards, and thrive in an honest, collaborative environment.')}</p>
                    <p>{it.L('If you\'re looking to build a career, and not a resume, talk to us, [_1]. We\'re one of the IT world\'s most vibrant and progressive workplaces.', it.website_name)}</p>
                </div>
            </div>

            <SeparatorLine />

            <div className='gr-row gr-padding-30'>
                <ColumnMD header={it.L('Want to telecommute?')} paragraph={it.L('[_1] is a dynamic and flexible workplace. As well as our offices, we have employees who choose to telecommute from their home offices in countries around the world. If that suits you, we\'re open to it.', it.website_name) } />
                <ColumnMD header={it.L('Where you can go')}     paragraph={it.L('Kick back with beautiful beaches, islands, and mountains just a short flight away. From Malta, you have Europe, the Mediterranean, and North Africa. And from Malaysia, the whole of Asia awaits.') } />
                <ColumnMD header={it.L('More benefits')}        paragraph={it.L('We offer a market-based salary, annual performance bonus, health benefits, travel and internet allowances, and company trips. Enjoy a high standard of living, whether you\'re in Malta, Malaysia, or Japan.')} />
            </div>

            <SeparatorLine />

            <div className='gr-row gr-padding-30 center-text'>
                <div className='gr-12'>
                    <h1>{it.L('Ideas, opinions, and insights from the people behind [_1]', it.website_name)}</h1>
                    <p>{it.L('Passionate about people, culture, management, and software development? Explore what we do, what matters to us, and how we bring our ideas to life.')}</p>
                </div>
                <FillBox
                    image='images/pages/careers/bb-icon.svg'
                    href='https://blog.binary.com'
                    padding='6'
                    text={it.L('Read the [_1] company blog', it.website_name)}
                    target='_blank'
                />
                <FillBox
                    image='images/pages/careers/tb-icon.svg'
                    href='https://tech.binary.com'
                    padding='6'
                    text={it.L('Read the [_1] tech blog', it.website_name)}
                    target='_blank'
                />
            </div>
        </div>

        <div className='fill-bg-color'>
            <div className='container'>
                <div className='gr-row gr-padding-30 center-text'>
                    <div className='gr-12 gr-padding-30'>
                        <h1>{it.L('Our locations')}</h1>
                    </div>

                    <ColumnLG image='my@2'      text={it.L('Malaysia')} />
                    <ColumnLG image='malta@1'   text={it.L('Malta')} />
                    <div className='gr-6 gr-push-3 gr-12-m gr-push-0-m'>
                        <img className='responsive' src={it.url_for('images/pages/careers/japan@1.jpg')} />
                        <p>{it.L('Japan')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className='container'>
            <div className='gr-padding-30 center-text'>
                <div className='gr-padding-30'>
                    <h1>{it.L('Career opportunities for Americans')}</h1>
                    <p>{it.L('Looking for a new and exciting career in a country that\'s modern, diverse and tolerant? [_1] is one of the world\'s most progressive companies, with offices in Asia and Europe.', it.website_name)}</p>
                </div>

                <FillBox center padding='4' href={it.url_for('careers-for-americans')} text={it.L('Learn more')} />
            </div>

            <SeparatorLine />

            <div className='gr-padding-30 center-text'>
                <h1>{it.L('Open positions')}</h1>
                <p>{it.L('[_1] is always looking to add experienced professionals to its talented team of administrators, technical contributors, and managers. To support our continued growth, we\'ve developed a number of exciting career opportunities in the following areas:', it.website_name)}</p>
            </div>

            <div className='gr-10 gr-12-m gr-centered'>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m'>
                        <ul className='checked'>
                            <li>{it.L('Software (Perl) Development')}</li>
                            <li>{it.L('DevOps Engineering')}</li>
                            <li>{it.L('Information Security')}</li>
                            <li>{it.L('Front-End (Javascript) Development')}</li>
                            <li>{it.L('Quantitative Analytics')}</li>
                        </ul>
                    </div>
                    <div className='gr-6 gr-12-m'>
                        <ul className='checked'>
                            <li>{it.L('Online Marketing')}</li>
                            <li>{it.L('Business Development')}</li>
                            <li>{it.L('Graphics Design')}</li>
                            <li>{it.L('Customer Support')}</li>
                            <li>{it.L('Legal & Regulatory Compliance')}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <CareersShared />
        </div>
    </div>
);

export default Careers;
